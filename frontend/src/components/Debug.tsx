// frontend\src\components\Debug.tsx

import { useUserStore, useFlashMessageStore } from '../state/store';

const Debug = () => {
    const { user } = useUserStore();
    const { flashMessage } = useFlashMessageStore();
    return (
        <div className="flex justify-start bg-yellow-100 p-4 pl-16 gap-4 rounded-lg items-start">
            <>
                <div className="font-bold">user</div>
                {user ? (
                    <div className="flex flex-col gap-4 border-r-2 border-gray-300 pr-8 mr-8">
                        <div>
                            {Object.entries(user).map(([key, value]) => (
                                <p key={key} className="break-words">{`${key}: ${value}`}</p>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>user null</p>
                )}
            </>

            <>
                <div className="font-bold">flashMessage</div>
                {flashMessage ? (
                    <p>{flashMessage}</p>
                ) : (
                    <p>flashMessage null</p>
                )}
            </>
        </div>
    );
};

export default Debug;
