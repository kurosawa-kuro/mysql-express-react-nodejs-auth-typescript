// frontend\src\components\Debug.tsx

import { useUserStore, useFlashMessageStore } from '../state/store';

const Debug = () => {
    const { user } = useUserStore();
    const { flashMessage } = useFlashMessageStore();
    return (
        <div style={{ 'backgroundColor': '#f0808038' }}>
            {user ? (
                <div style={{ 'display': 'flex', 'gap': '10px' }}>
                    <div>user</div>
                    <div>
                        {Object.entries(user).map(([key, value]) => (
                            <p key={key}>{`${key}: ${value}`}</p>
                        ))}
                    </div>
                </div>
            ) : (
                <p>user null</p>
            )}

            {flashMessage ? (
                <div>
                    {flashMessage}
                </div>
            ) : (
                <p>flashMessage null</p>
            )}
        </div>
    )
}

export default Debug
