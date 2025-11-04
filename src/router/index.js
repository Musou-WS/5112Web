import { createWebHistory, createRouter } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
    	{ path: '/', component: () => import('../views/storyGenerator.vue') },
        { path: '/auto', component: () => import('../views/storyGeneratorAuto.vue') }
    ],
})

export default router