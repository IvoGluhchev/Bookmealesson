import axios, { AxiosError, AxiosResponse } from "axios";
// import { toNamespacedPath } from "path";
import { Activity } from "../models/activity";
import { toast } from "react-toastify"
import { store } from "../stores/store";
import { history } from "../..";
import { User, UserFormValues } from "../models/user";

//Actually this is a CLIENT (here called agent)
//
// AXIOS
//
// TODO: Remove this sleep cons
// setting a delay
const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

 axios.interceptors.request.use(config => {
     const token = store.commonStore.token;
     if(token) config.headers!.Authorization = `Bearer ${token}`;
     return config
 })

// axios interceptors is used to intercept the response and request and do something with them
axios.interceptors.response.use(async response => {
    await sleep(1000);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response!;
    // console.log(error.response);
    switch (status) {
        case 400:
            if(config.method === 'get' && data.errors.hasOwnProperty('id')){
                history.push('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            //toast.error('not found');
            history.push('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push('/server-error');
            //toast.error('internal server error');
            break;
    }
    return Promise.reject(error);
})

// Making the response body generic so that we can say what type we expect
const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

// Objects for Activity Requests
const Activities = {
    // list: () => requests.get('/activities') - without type safety
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

// Objects for User/Account Requests
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('account/register', user)
}

// client (this is actually a client not an agent)
const agent = {
    Activities,
    Account
}

export default agent;