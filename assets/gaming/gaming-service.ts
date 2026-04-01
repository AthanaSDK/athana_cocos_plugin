import { bridge } from "../bridge/native-bridge";
import { SdkCallback, SdkResult } from "../bridge/sdk-result";
import {
    Achievement,
    AchievementExtraInfo,
    AchievementType,
    AchievementState,
    FriendList,
    GetLeaderboardInfoParam,
    GetScoreParam,
    LeaderboardInfo,
    LoadFriendsParam,
    LoadLeaderboardDataParam,
    LoadMoreLeaderboardDataParam,
    OpenLeaderboardUIParam,
    PageDirection,
    PlayerProfile,
    ScoreData,
    ScoreExtraInfo,
    ScoreList,
    SubmitScoreParam,
    UnlockAchievementParam,
    UpdateAchievementProgressParam,
    LeaderboardPlayerScope,
    LeaderboardTimeSpan
} from "./gaming-models";

export {
    Achievement,
    AchievementExtraInfo,
    AchievementType,
    AchievementState,
    FriendList,
    GetLeaderboardInfoParam,
    GetScoreParam,
    LeaderboardInfo,
    LoadFriendsParam,
    LoadLeaderboardDataParam,
    LoadMoreLeaderboardDataParam,
    OpenLeaderboardUIParam,
    PageDirection,
    PlayerProfile,
    ScoreData,
    ScoreExtraInfo,
    ScoreList,
    SubmitScoreParam,
    UnlockAchievementParam,
    UpdateAchievementProgressParam,
    LeaderboardPlayerScope,
    LeaderboardTimeSpan
}

export class GamingService {

    submitScore(param: SubmitScoreParam): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const methodName = "submitScore";
            if (param.immediate) {
                bridge.dispathcer.once<SdkResult<boolean>>(
                    methodName,
                    (result) => {
                        if (result.error != null) {
                            reject(result.error);
                        } else {
                            resolve(result.data);
                        }
                    });
            }
            bridge.send2Native<SubmitScoreParam>(methodName, param);
            if (param.immediate != true) {
                resolve(true);
            }
        });
    }

    getScore(param: GetScoreParam): Promise<ScoreData> {
        return new Promise((resolve, reject) => {
            const methodName = "getScore";
            bridge.dispathcer.once<SdkResult<ScoreData>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<GetScoreParam>(methodName, param);
        });
    }

    openLeaderboardUI(param: OpenLeaderboardUIParam): Promise<void> {
        return new Promise((resolve, reject) => {
            const methodName = "openLeaderboardUI";
            bridge.dispathcer.once<SdkResult<void>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<OpenLeaderboardUIParam>(methodName, param);
        });
    }

    getLeaderboardInfo(param: GetLeaderboardInfoParam): Promise<LeaderboardInfo[]> {
        return new Promise((resolve, reject) => {
            const methodName = "getLeaderboardInfo";
            bridge.dispathcer.once<SdkResult<LeaderboardInfo[]>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<GetLeaderboardInfoParam>(methodName, param);
        });
    }

    loadLeaderboardData(param: LoadLeaderboardDataParam): Promise<ScoreList> {
        return new Promise((resolve, reject) => {
            const methodName = "loadLeaderboardData";
            bridge.dispathcer.once<SdkResult<ScoreList>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<LoadLeaderboardDataParam>(methodName, param);
        });
    }

    loadMoreLeaderboardData(param: LoadMoreLeaderboardDataParam): Promise<ScoreList> {
        return new Promise((resolve, reject) => {
            const methodName = "loadMoreLeaderboardData";
            bridge.dispathcer.once<SdkResult<ScoreList>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<LoadMoreLeaderboardDataParam>(methodName, param);
        });
    }

    leaderboardDataRelease(): Promise<void> {
        return new Promise((resolve, reject) => {
            const methodName = "leaderboardDataRelease";
            bridge.dispathcer.once<SdkResult<void>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<void>(methodName);
        });
    }

    unlockAchievement(param: UnlockAchievementParam): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const methodName = "unlockAchievement";
            if (param.immediate) {
                bridge.dispathcer.once<SdkResult<boolean>>(
                    methodName,
                    (result) => {
                        if (result.error != null) {
                            reject(result.error);
                        } else {
                            resolve(result.data);
                        }
                    });
            }
            bridge.send2Native<UnlockAchievementParam>(methodName, param);
            if (param.immediate != true) {
                resolve(true);
            }
        });
    }

    updateAchievementProgress(param: UpdateAchievementProgressParam): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const methodName = "updateAchievementProgress";
            if (param.immediate) {
                bridge.dispathcer.once<SdkResult<boolean>>(
                    methodName,
                    (result) => {
                        if (result.error != null) {
                            reject(result.error);
                        } else {
                            resolve(result.data);
                        }
                    });
            }
            bridge.send2Native<UpdateAchievementProgressParam>(methodName, param);
            if (param.immediate != true) {
                resolve(true);
            }
        });
    }

    openAchievementUI(): Promise<void> {
        return new Promise((resolve, reject) => {
            const methodName = "openAchievementUI";
            bridge.dispathcer.once<SdkResult<void>>(
                methodName,
                (result) => {
                    if (result.error != null) {
                        reject(result.error);
                    } else {
                        resolve(result.data);
                    }
                });
            bridge.send2Native<void>(methodName);
        });
    }

    getAchievementData(forceReload: boolean, callback: SdkCallback<Achievement[]>) {
        const methodName = "getAchievementData";
        bridge.dispathcer.once<SdkResult<Achievement[]>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            });
        bridge.send2Native<object>(methodName, { "forceReload": forceReload });
    }

    requestFriendListPermission(callback: SdkCallback<void>) {
        const methodName = "requestFriendListPermission";
        bridge.dispathcer.once<SdkResult<void>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            });
        bridge.send2Native<void>(methodName);
    }

    loadFriends(param: LoadFriendsParam, callback: SdkCallback<FriendList>) {
        const methodName = "loadFriends";
        bridge.dispathcer.once<SdkResult<FriendList>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            });
        bridge.send2Native<LoadFriendsParam>(methodName, param);
    }

    loadMoreFriends(pageSize: number, callback: SdkCallback<FriendList>) {
        const methodName = "loadMoreFriends";
        bridge.dispathcer.once<SdkResult<FriendList>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            });
        bridge.send2Native<object>(methodName, { "pageSize": pageSize });
    }

    openPlayerProfileUI(playerId: string, callback: SdkCallback<void>) {
        const methodName = "openPlayerProfileUI";
        bridge.dispathcer.once<SdkResult<void>>(
            methodName,
            (result) => {
                if (result.error != null) {
                    callback.onError(result.error);
                } else {
                    callback.onSuccess(result.data);
                }
            });
        bridge.send2Native<object>(methodName, { "playerId": playerId });
    }

}