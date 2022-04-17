
const routeConstants = {
    basePath: () => '/',
    activities: () => '/activities',
    activitiesDetials: (id: string) => `/activities/${id}`,
    createActivity: () => '/createActivity'
}

export default routeConstants