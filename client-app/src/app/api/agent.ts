import axios, { AxiosError, AxiosResponse } from "axios";
// import { toNamespacedPath } from "path";
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity, ActivityFormValues } from '../models/activity';
import { PaginatedResult } from "../models/pagination";
//import { PaginatedResult } from '../models/pagination';
import { Photo, Profile, UserActivity } from '../models/profile';
import { User, UserFormValues } from '../models/user';
import { store } from '../stores/store';

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

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token) config.headers!.Authorization = `Bearer ${token}`;
    return config
})

// axios interceptors is used to intercept the response and request and do something with them
axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development')
        await sleep(1000);

    const pagination = response.headers['pagination'];

    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>; // this casting will give us intelisense
    }

    return response;

}, (error: AxiosError) => {
    const { data, status, config } = error.response!;
    // console.log(error.response);
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
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
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

// Objects for User/Account Requests
const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('account/register', user),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {})
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) =>
        requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) =>
        requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`) // Could be turned into a paged list like const Activities list to have infinite scroll and create params object
}

// client (this is actually a client not an agent)
const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;