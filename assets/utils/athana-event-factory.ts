import { AthanaEvent } from "../athana";

export class AthanaEventFactory {

    /**
     * 退出登录事件
     */
    static logout(params?: Map<string, any>): AthanaEvent {
        return new AthanaEvent("Logout", params)
    }

    /**
     * 记录游戏任务事件
     *
     * @param taskId 任务ID
     * @param taskType 任务类型
     *     - 1 - 一次性任务
     *     - 2 - 重复任务
     * @param repeatCycle 重复周期，是重复任务的前提下可传秒钟为单位，传int数字，每日重复，则传 86400
     * @param repeatCycleTimes 期望数量
     */
    static logGamesTask(
        taskId: number,
        taskType: number,
        repeatCycle?: number,
        repeatCycleTimes?: number,
        params?: Map<string, any>,
    ): AthanaEvent {
        const paramsMap: Map<string, any> = new Map();

        paramsMap.set("task_id", taskId);
        paramsMap.set("task_type", taskType);
        if (repeatCycle != null) paramsMap.set("repeat_cycle", repeatCycle);
        if (repeatCycleTimes != null) paramsMap.set("repeat_cycle_tims", repeatCycleTimes);
        if (params != null) {
            params.forEach((value, key) => paramsMap.set(key, value));
        }
        return new AthanaEvent("Task", paramsMap);
    }

    /**
     * 游戏通关成功事件
     *
     * @param clearCostTime 通关消耗时长，精确到毫秒
     * @param level 通关关卡，字符串，需要区分小关的话，可以用 "1-10"、"1-11"等
     * @param score 通过分数
     * @param clearTimes 累计通关关卡次数
     * @param isRecharge 是否在关卡中充值，1-是；2-否
     * @param rechargeAmount 充值金额,如果有充值，可传,最好以 美元/美分为单位
     * @param currency 如果广告商返回非 美元/美分 的预估收益，需要将 货币单位 返回来
     * @param paid 是否收费关卡，1-是；2-否
     */
    static logGamesStageFinished(
        clearCostTime: number,
        level: string,
        score?: number,
        clearTimes?: number,
        isRecharge?: number,
        rechargeAmount?: number,
        currency?: string,
        paid?: number,
        params?: Map<string, any>,
    ): AthanaEvent {
        const paramsMap: Map<string, any> = new Map();
        paramsMap.set("clear_cost_time", clearCostTime);
        paramsMap.set("level", level);

        if (score != null) paramsMap.set("score", score);
        if (clearTimes != null) paramsMap.set("clear_times", clearTimes);
        if (isRecharge != null) paramsMap.set("is_recharge", isRecharge);
        if (rechargeAmount != null) paramsMap.set("recharge_amount", rechargeAmount);
        if (currency != null) paramsMap.set("currency", currency);
        if (paid != null) paramsMap.set("is_vip", paid);

        if (params != null) {
            params.forEach((value, key) => paramsMap.set(key, value));
        }
        return new AthanaEvent("ClearRecord", paramsMap)
    }

    /**
     * 游戏通关失败事件
     *
     * @param clearCostTime 通关消耗时长，精确到毫秒
     * @param level 当前关卡，字符串，需要区分小关的话，可以用 "1-10"、"1-11"等
     * @param levelType 关卡类型
     *     - 0 - 普通关卡
     *     - 1 - 副本关卡
     *     - 2 - 日常关卡
     * @param reason 失败原因
     *     - 1 - 超过限制时间
     *     - 2 - 没有可移动的步骤
     * @param paid 是否收费关卡，1-是；2-否
     */
    static logGamesStageNotFinish(
        clearCostTime: number,
        level: string,
        levelType?: number,
        reason?: number,
        paid?: number,
        params?: Map<string, any>,
    ): AthanaEvent {
        const paramsMap: Map<string, any> = new Map();
        paramsMap.set("clear_cost_time", clearCostTime);
        paramsMap.set("level", level);

        if (levelType != null) paramsMap.set("level_type", levelType);
        if (reason != null) paramsMap.set("reason", reason);
        if (paid != null) paramsMap.set("is_vip", paid);

        if (params != null) {
            params.forEach((value, key) => paramsMap.set(key, value));
        }
        return new AthanaEvent("ClearFailRecord", paramsMap)
    }

    /**
     * 新手教程完成事件
     *
     * @param costTime 消耗时长，精确到毫秒
     * @param startTrialId 新手教程id
     * @param startTrialName 新手教程名称
     */
    static logGamesStartTrialFinished(
        costTime: number,
        startTrialId: number,
        startTrialName?: string,
        params?: Map<string, any>,
    ): AthanaEvent {
        const paramsMap: Map<string, any> = new Map();
        paramsMap.set("cost_time", costTime);
        paramsMap.set("start_trial_id", startTrialId);
        paramsMap.set("is_succ", 1);
        if (startTrialName != null) paramsMap.set("start_trial_name", startTrialName);
        if (params != null) {
            params.forEach((value, key) => paramsMap.set(key, value));
        }
        return new AthanaEvent("StartTrial", paramsMap)
    }

    /**
     * 新手教程未完成（跳过）事件
     *
     * @param costTime 消耗时长，精确到毫秒
     * @param startTrialId 新手教程id
     * @param startTrialName 新手教程名称
     */
    static logGamesStartTrialNotFinish(
        costTime: number,
        startTrialId: number,
        startTrialName?: string,
        params?: Map<string, any>,
    ): AthanaEvent {
        const paramsMap: Map<string, any> = new Map();
        paramsMap.set("cost_time", costTime);
        paramsMap.set("start_trial_id", startTrialId);
        paramsMap.set("is_succ", 2);
        if (startTrialName != null) paramsMap.set("start_trial_name", startTrialName);
        if (params != null) {
            params.forEach((value, key) => paramsMap.set(key, value));
        }
        return new AthanaEvent("StartTrial", paramsMap)
    }

    /**
     * 游戏角色升级/关卡通过事件
     *
     * @param oldLevel 旧等级 / 关卡
     * @param newLevel 新等级 / 关卡
     * @param scene 发生场景
     *     - 1 - 通关关卡（副本）
     *     - 2 - 做任务
     *     - 3 - 击杀小怪
     * @param sceneExt 场景额外参数，例如：第几关卡、任务ID
     * @param roleId 游戏角色Id，适用于多角色类游戏
     */
    static logGamesLevelUp(
        oldLevel: number,
        newLevel: number,
        scene?: number,
        sceneExt?: string,
        roleId?: number,
        params?: Map<string, any>,
    ): AthanaEvent {
        const paramsMap: Map<string, any> = new Map();
        paramsMap.set("old_level", oldLevel);
        paramsMap.set("new_level", newLevel);
        if (scene != null) paramsMap.set("scene", scene);
        if (sceneExt != null) paramsMap.set("scene_ext", sceneExt);
        if (roleId != null) paramsMap.set("role_id", roleId);
        if (params != null) {
            params.forEach((value, key) => paramsMap.set(key, value));
        }
        return new AthanaEvent("LevelAchieved", paramsMap)
    }

    /**
     * 记录分享事件
     */
    static logShare(params?: Map<string, any>): AthanaEvent {
        return new AthanaEvent("Share", params)
    }

    /**
     * 记录邀请事件
     */
    static logInvite(params?: Map<string, any>): AthanaEvent {
        return new AthanaEvent("Invite", params)
    }

}