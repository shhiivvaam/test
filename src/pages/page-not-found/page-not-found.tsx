import React from 'react';
import Layout from '../../hoc/layout/layout';

const PageNotFound = () => (
    <Layout>
        <section className="pt-10 pb-10 pr-0 pl-0 bg-white w-screen h-screen">
            <div className="grid place-content-center">
                <div className="grid col-span-12">
                    <div className="col-span-10 text-center">
                        <div className="bg-[url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')] h-96 bg-center">
                            <h1 className="text-center text-7xl font-poppins-bold">404</h1>
                        </div>
                        <div className="mt-[-50px]">
                            <h3 className="text-7xl mt-4 font-poppins-medium">
                                Looks like you're lost
                            </h3>
                            <p className="mt-5 font-poppins-regular">The page you are looking for is not available!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>
)

export default PageNotFound;
