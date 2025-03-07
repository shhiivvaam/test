import React, {ReactNode, useEffect} from "react";

import useWindowDimensions from '../../hooks/useWindowDimensions';

type LayoutProps = {
    children: ReactNode,
}

const Layout = ({children}: LayoutProps): JSX.Element => {
    const {width, height} = useWindowDimensions();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    return (
        <div style={{width, height}} className="overflow-y-scroll">
            <main className="p-0">
                {children}
            </main>
        </div>
    )
}

export default Layout;
