const getDefaultState = () => {
    return {
        chooseTakeResponsibilityID: '', // 选中的担当ID
        chooseTakeResponsibilityName: '', // 选中的担当name
        chooseTakeResponsibilityParenID: '' // 选中担当的组织id
    }
}

const state = getDefaultState()
const getters = {
    chooseTakeResponsibilityID: state => state.chooseTakeResponsibilityID,
    chooseTakeResponsibilityName: state => state.chooseTakeResponsibilityName,
    chooseTakeResponsibilityParenID:state => state.chooseTakeResponsibilityParenID
}
const mutations = {
    // 重置 状态
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TAKE_RESPONSIBILITY(state, info) {
        state.chooseTakeResponsibilityID = info.id
        state.chooseTakeResponsibilityName = info.name
        state.chooseTakeResponsibilityParenID = info.parentId
    },
    Reset_TAKE_RESPONSIBILITY(state){
        state.chooseTakeResponsibilityID = ''
        state.chooseTakeResponsibilityName = ''
        state.chooseTakeResponsibilityParenID = ''
    }
}

const actions = {
    set_take_responsibility({commit}, data) {
        commit('SET_TAKE_RESPONSIBILITY', data)
    }
}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
