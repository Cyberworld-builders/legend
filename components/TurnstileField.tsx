'use client';

import { useCallback } from 'react';
import { Turnstile } from 'react-turnstile';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileFieldProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}

export default function TurnstileField({ onVerify, onExpire }: TurnstileFieldProps) {
  const handleVerify = useCallback(
    (token: string) => {
      onVerify(token);
    },
    [onVerify]
  );

  if (!siteKey) return null;

  return (
    <div className="min-h-px [&_iframe]:max-h-[65px]">
      <Turnstile
        sitekey={siteKey}
        onVerify={handleVerify}
        onExpire={onExpire}
        theme="dark"
        appearance="execute"
        refreshExpired="auto"
      />
    </div>
  );
}
