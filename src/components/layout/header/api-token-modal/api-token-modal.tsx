import React, { useState } from 'react';
import { generateDerivApiInstance } from '@/external/bot-skeleton/services/api/appId';
import Button from '@/components/shared_ui/button';
import { LegacyClose1pxIcon } from '@deriv/quill-icons/Legacy';
import { Localize } from '@deriv-com/translations';
import './api-token-modal.scss';

type TApiTokenModalProps = {
    is_visible: boolean;
    onClose: () => void;
};

const ApiTokenModal = ({ is_visible, onClose }: TApiTokenModalProps) => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [is_loading, setIsLoading] = useState(false);

    if (!is_visible) return null;

    const handleLogin = async () => {
        if (!token.trim()) {
            setError('Please enter your API token.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const api = generateDerivApiInstance();
            const { authorize, error: api_error } = await api.authorize(token.trim());
            api.disconnect();

            if (api_error) {
                setError(api_error.message || 'Invalid token. Please check and try again.');
                setIsLoading(false);
                return;
            }

            const account_list: Array<{ loginid: string; token: string; currency: string }> = authorize.account_list.map(
                (account: { loginid: string; currency: string }) => ({
                    loginid: account.loginid,
                    token: token.trim(),
                    currency: account.currency,
                })
            );

            const accounts_map: Record<string, string> = {};
            const client_accounts: Record<string, { loginid: string; token: string; currency: string }> = {};

            account_list.forEach(account => {
                accounts_map[account.loginid] = token.trim();
                client_accounts[account.loginid] = account;
            });

            localStorage.setItem('accountsList', JSON.stringify(accounts_map));
            localStorage.setItem('clientAccounts', JSON.stringify(client_accounts));
            localStorage.setItem('authToken', token.trim());
            localStorage.setItem('active_loginid', authorize.loginid);
            localStorage.setItem('client.country', authorize.country ?? '');

            window.location.reload();
        } catch (err) {
            setError('Unable to connect. Please check your token and try again.');
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleLogin();
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className='api-token-modal__overlay' onClick={handleOverlayClick}>
            <div className='api-token-modal__dialog' role='dialog' aria-modal='true'>
                <div className='api-token-modal__header'>
                    <span className='api-token-modal__title'>
                        <Localize i18n_default_text='Log in with API token' />
                    </span>
                    <button className='api-token-modal__close' onClick={onClose} aria-label='Close'>
                        <LegacyClose1pxIcon height='20px' width='20px' fill='var(--text-general)' />
                    </button>
                </div>

                <div className='api-token-modal__body'>
                    <p className='api-token-modal__description'>
                        <Localize i18n_default_text='Enter your Deriv API token to log in. You can generate one from your Deriv account settings.' />
                    </p>
                    <div className='api-token-modal__input-wrapper'>
                        <label className='api-token-modal__label' htmlFor='api-token-input'>
                            <Localize i18n_default_text='API Token' />
                        </label>
                        <input
                            id='api-token-input'
                            type='password'
                            className={`api-token-modal__input${error ? ' api-token-modal__input--error' : ''}`}
                            placeholder='Enter your API token'
                            value={token}
                            onChange={e => {
                                setToken(e.target.value);
                                if (error) setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            autoComplete='off'
                            disabled={is_loading}
                        />
                        {error && <span className='api-token-modal__error'>{error}</span>}
                    </div>
                    <p className='api-token-modal__hint'>
                        <Localize i18n_default_text='Make sure your token has the required permissions (Read, Trade).' />
                    </p>
                </div>

                <div className='api-token-modal__footer'>
                    <Button secondary onClick={onClose} disabled={is_loading}>
                        <Localize i18n_default_text='Cancel' />
                    </Button>
                    <Button primary onClick={handleLogin} is_loading={is_loading} disabled={is_loading || !token.trim()}>
                        <Localize i18n_default_text='Log in' />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ApiTokenModal;
