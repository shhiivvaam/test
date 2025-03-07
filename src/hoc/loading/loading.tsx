import React, {useState, ComponentType} from "react";

import Loader from "../../components/loader/loader";

function withLoading<P>(WrappedComponent: ComponentType<P>, loadingMessage: string) {
    function HOC(props: P) {
        const [isLoading, setLoading] = useState<boolean>(false);

        const setLoadingState = (isComponentLoading: boolean) => {
            setLoading(isComponentLoading);
        }

        return (
            <>
                {isLoading ? <Loader loadingMessage={loadingMessage}/> : <WrappedComponent {...props} setLoading={setLoadingState}/>}
            </>
        )
    }

    return HOC;
}

export default withLoading;
