import axios, {AxiosResponse} from "axios";

export const createCustomerPortal = async (customerId: string): Promise<AxiosResponse> => {
    const data = JSON.stringify({
        "customer_id": customerId
    });
    return axios.post(process.env.REACT_APP_CREATE_CUSTOMER_PORTAL as string, data, {headers: {'Content-Type': 'application/json'}});
}
