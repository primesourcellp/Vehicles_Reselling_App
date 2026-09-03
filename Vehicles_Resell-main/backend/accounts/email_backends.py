"""Send email via Microsoft Graph API (Azure app registration)."""

import logging

import requests
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend

logger = logging.getLogger(__name__)


class AzureGraphEmailBackend(BaseEmailBackend):
    """
    Django email backend using Azure AD client credentials + Graph sendMail.

    Required settings / env:
      AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_SENDER_EMAIL
    """

    TOKEN_URL = 'https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token'
    SEND_URL = 'https://graph.microsoft.com/v1.0/users/{sender}/sendMail'

    def __init__(self, fail_silently=False, **kwargs):
        super().__init__(fail_silently=fail_silently, **kwargs)
        self.tenant_id = getattr(settings, 'AZURE_TENANT_ID', '') or ''
        self.client_id = getattr(settings, 'AZURE_CLIENT_ID', '') or ''
        self.client_secret = getattr(settings, 'AZURE_CLIENT_SECRET', '') or ''
        self.sender_email = getattr(settings, 'AZURE_SENDER_EMAIL', '') or ''

    def _get_access_token(self):
        url = self.TOKEN_URL.format(tenant=self.tenant_id)
        response = requests.post(
            url,
            data={
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'scope': 'https://graph.microsoft.com/.default',
                'grant_type': 'client_credentials',
            },
            timeout=30,
        )
        response.raise_for_status()
        return response.json()['access_token']

    def _build_message(self, email_message):
        to_recipients = [
            {'emailAddress': {'address': addr}} for addr in email_message.to
        ]
        cc_recipients = [
            {'emailAddress': {'address': addr}} for addr in (email_message.cc or [])
        ]
        bcc_recipients = [
            {'emailAddress': {'address': addr}} for addr in (email_message.bcc or [])
        ]

        body_content = email_message.body or ''
        content_type = 'HTML' if email_message.content_subtype == 'html' else 'Text'

        # Prefer HTML alternative if present
        if hasattr(email_message, 'alternatives'):
            for content, mimetype in email_message.alternatives:
                if mimetype == 'text/html':
                    body_content = content
                    content_type = 'HTML'
                    break

        message = {
            'message': {
                'subject': email_message.subject or '',
                'body': {
                    'contentType': content_type,
                    'content': body_content,
                },
                'toRecipients': to_recipients,
            },
            'saveToSentItems': True,
        }
        if cc_recipients:
            message['message']['ccRecipients'] = cc_recipients
        if bcc_recipients:
            message['message']['bccRecipients'] = bcc_recipients

        return message

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        if not all(
            [self.tenant_id, self.client_id, self.client_secret, self.sender_email]
        ):
            error = (
                'Azure Graph email is not configured. '
                'Set AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_SENDER_EMAIL.'
            )
            if not self.fail_silently:
                raise RuntimeError(error)
            logger.error(error)
            return 0

        sent = 0
        try:
            token = self._get_access_token()
        except Exception as exc:
            logger.exception('Failed to get Azure access token')
            if not self.fail_silently:
                raise
            return 0

        url = self.SEND_URL.format(sender=self.sender_email)
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
        }

        for email_message in email_messages:
            try:
                payload = self._build_message(email_message)
                response = requests.post(url, json=payload, headers=headers, timeout=30)
                if response.status_code not in (202, 200):
                    raise RuntimeError(
                        f'Graph sendMail failed ({response.status_code}): {response.text}'
                    )
                sent += 1
            except Exception:
                logger.exception('Failed to send email via Azure Graph')
                if not self.fail_silently:
                    raise

        return sent
