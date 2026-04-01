//
//  GamingProxyService.swift
//  Athana Demo
//
//  Created by CWJoy on 30/03/2026.
//
import AthanaCore
import AthanaSDK

private let methodSubmitScore = "submitScore"
private let methodGetScore = "getScore"
private let methodOpenLeaderboardUI = "openLeaderboardUI"
private let methodGetLeaderboardInfo = "getLeaderboardInfo"
private let methodLoadLeaderboardData = "loadLeaderboardData"
private let methodLoadMoreLeaderboardData = "loadMoreLeaderboardData"

private let methodUnlockAchievement = "unlockAchievement"
private let methodUpdateAchievementProgress = "updateAchievementProgress"
private let methodOpenAchievementUI = "openAchievementUI"
private let methodGetAchievementData = "getAchievementData"

private let methodRequestFriendListPermission = "requestFriendListPermission"
private let methodLoadFriends = "loadFriends"
private let methodLoadMoreFriends = "loadMoreFriends"
private let methodOpenPlayerProfileUI = "openPlayerProfileUI"

class GamingProxyService: SDKService {
    
    private var playerMap: [String : PlayerProfile] = [:]
    
    func initialize() {
        initLeaderboardMethods()
        initAchievementMethods()
        initFriendMethods()
    }
    
    private func initLeaderboardMethods() {
        CocosEventDispatcher.shared.register(
            methodSubmitScore,
            listener: { data in self.submitScore(data) },
            codec: JSONCodec<SubmitScoreParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodGetScore,
            listener: { data in self.getScore(data) },
            codec: JSONCodec<GetScoreParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodOpenLeaderboardUI,
            listener: { data in self.openLeaderboardUI(data) },
            codec: JSONCodec<OpenLeaderboardUIParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodGetLeaderboardInfo,
            listener: { data in self.getLeaderboardInfo(data) },
            codec: JSONCodec<GetLeaderboardInfoParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodLoadLeaderboardData,
            listener: { data in self.loadLeaderboardData(data) },
            codec: JSONCodec<LoadLeaderboardDataParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodLoadMoreLeaderboardData,
            listener: { data in self.loadMoreLeaderboardData(data) },
            codec: JSONCodec<LoadMoreLeaderboardDataParam>()
        )
    }
    
    private func initAchievementMethods() {
        CocosEventDispatcher.shared.register(
            methodUnlockAchievement,
            listener: { data in self.unlockAchievement(data) },
            codec: JSONCodec<UnlockAchievementParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodUpdateAchievementProgress,
            listener: { data in self.updateAchievementProgress(data) },
            codec: JSONCodec<UpdateAchievementProgressParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodOpenAchievementUI,
            listener: { self.openAchievementUI() }
        )
        
        CocosEventDispatcher.shared.register(
            methodGetAchievementData,
            listener: { data in self.getAchievementData(data) },
            codec: JSONCodec<GetAchievementDataParam>()
        )
    }
    
    private func initFriendMethods() {
        CocosEventDispatcher.shared.register(
            methodRequestFriendListPermission,
            listener: { self.requestFriendListPermission() }
        )
        
        CocosEventDispatcher.shared.register(
            methodLoadFriends,
            listener: { data in self.loadFriends(data) },
            codec: JSONCodec<LoadFriendsParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodLoadMoreFriends,
            listener: { data in self.loadMoreFriends(data) },
            codec: JSONCodec<LoadMoreFriendsParam>()
        )
        
        CocosEventDispatcher.shared.register(
            methodOpenPlayerProfileUI,
            listener: { data in self.openPlayerProfileUI(data) },
            codec: JSONCodec<OpenPlayerProfileUIParam>()
        )
    }
    
    func submitScore(_ data: SubmitScoreParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodSubmitScore) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodSubmitScore,
                data: SdkResult<Bool>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodSubmitScore, action: {
                let result = try await GamingService.shared.submitScore(
                    leaderboardId: param.leaderboardId,
                    score: param.score
                )
                if (param.immediate) {
                    CocosEventDispatcher.shared.send(
                        methodSubmitScore,
                        data: SdkResult<Bool>(data: result)
                    )
                }
            })
        })
    }
    
    func getScore(_ data: GetScoreParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodGetScore) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodGetScore,
                data: SdkResult<ScoreData>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodGetScore, action: {
                let result = try await GamingService.shared.getScore(
                    leaderboardId: param.leaderboardId,
                    scope: param.scope.asLeaderboardPlayerScope(),
                    timeScope: param.timeScope.asLeaderboardTimeSpan()
                )
                CocosEventDispatcher.shared.send(
                    methodGetScore,
                    data: SdkResult<ScoreData>(data: result)
                )
            })
        })
    }
    
    func openLeaderboardUI(_ data: OpenLeaderboardUIParam?) {
        let scope: LeaderboardPlayerScope
        let timeScope: LeaderboardTimeSpan
        
        if let scopeStr = data?.scope {
            scope = scopeStr.asLeaderboardPlayerScope()
        } else {
            scope = .ALL
        }
        if let timeScopeStr = data?.timeScope {
            timeScope = timeScopeStr.asLeaderboardTimeSpan()
        } else {
            timeScope = .ALL_TIME
        }
        
        withActor({
            await handleSdkError(methodOpenLeaderboardUI, action: {
                let result = await GamingService.shared.openLeaderboardUI(
                    leaderboardId: data?.leaderboardId,
                    playerScope: scope,
                    timeScope: timeScope
                )
                CocosEventDispatcher.shared.send(
                    methodOpenLeaderboardUI,
                    data: SdkResult<Bool>(data: result)
                )
            })
        }, isMain: true)
    }
    
    func getLeaderboardInfo(_ data: GetLeaderboardInfoParam?) {
        withActor({
            await handleSdkError(methodGetLeaderboardInfo, action: {
                let result = try await GamingService.shared.getLeaderboardInfo(
                    leaderboardId: data?.leaderboardId
                )
                CocosEventDispatcher.shared.send(
                    methodGetLeaderboardInfo,
                    data: SdkResult<[LeaderboardInfo]>(data: result)
                )
            })
        })
    }
    
    private var lastLBIndex = 1
    private var lastLBPlayerScope: LeaderboardPlayerScope = .ALL
    private var lastLBTimeScope: LeaderboardTimeSpan = .ALL_TIME
    
    func loadLeaderboardData(_ data: LoadLeaderboardDataParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodLoadLeaderboardData) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodLoadLeaderboardData,
                data: SdkResult<ScoreList>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        let scope = param.scope.asLeaderboardPlayerScope()
        let timeScope = param.timeScope.asLeaderboardTimeSpan()
        
        lastLBPlayerScope = scope
        lastLBTimeScope = timeScope
        
        withActor({
            await handleSdkError(methodLoadLeaderboardData, action: {
                self.lastLBIndex = 1
                let result = try await GamingService.shared.loadLeaderboardScores(
                    leaderboardId: param.leaderboardId,
                    scope: scope,
                    timeScope: timeScope,
                    range: NSRange(location: self.lastLBIndex, length: param.pageSize),
                )
                
                for s in result.scoreList {
                    let player = s.player
                    let id = player.playerId
                    let exists = self.playerMap.contains(where: { $0.key == id })
                    if (!exists) {
                        self.playerMap[id] = player
                        break
                    }
                }
                
                if result.hasMore {
                    self.lastLBIndex += param.pageSize
                }
                CocosEventDispatcher.shared.send(
                    methodLoadLeaderboardData,
                    data: SdkResult<ScoreList>(data: result)
                )
            })
        })
    }
    
    func loadMoreLeaderboardData(_ data: LoadMoreLeaderboardDataParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodLoadMoreLeaderboardData) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodLoadMoreLeaderboardData,
                data: SdkResult<ScoreList>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodLoadMoreLeaderboardData, action: {
                let result = try await GamingService.shared.loadLeaderboardScores(
                    leaderboardId: param.leaderboardId,
                    scope: self.lastLBPlayerScope,
                    timeScope: self.lastLBTimeScope,
                    range: NSRange(location: self.lastLBIndex, length: param.pageSize),
                )
                
                for s in result.scoreList {
                    let player = s.player
                    let id = player.playerId
                    let exists = self.playerMap.contains(where: { $0.key == id })
                    if (!exists) {
                        self.playerMap[id] = player
                        break
                    }
                }
                
                if result.hasMore {
                    self.lastLBIndex += param.pageSize
                }
                CocosEventDispatcher.shared.send(
                    methodLoadMoreLeaderboardData,
                    data: SdkResult<ScoreList>(data: result)
                )
            })
        })
    }
    
    func unlockAchievement(_ data: UnlockAchievementParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodUnlockAchievement) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodUnlockAchievement,
                data: SdkResult<Bool>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodUnlockAchievement, action: {
                let result = try await GamingService.shared.unlockAchievement(
                    achievementId: param.achievementId
                )
                if param.immediate {
                    CocosEventDispatcher.shared.send(
                        methodUnlockAchievement,
                        data: SdkResult<Bool>(data: result)
                    )
                }
            })
        }, isMain: true)
    }
    
    func updateAchievementProgress(_ data: UpdateAchievementProgressParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodUpdateAchievementProgress) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodUpdateAchievementProgress,
                data: SdkResult<Bool>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodUpdateAchievementProgress, action: {
                let result = try await GamingService.shared.updateAchievementProgress(
                    achievementId: param.achievementId,
                    currentValue: Int(param.progress)
                )
                if param.immediate {
                    CocosEventDispatcher.shared.send(
                        methodUpdateAchievementProgress,
                        data: SdkResult<Bool>(data: result)
                    )
                }
            })
        })
    }
    
    func openAchievementUI() {
        withActor({
            await handleSdkError(methodOpenAchievementUI, action: {
                let result = await GamingService.shared.openAchievementUI()
                CocosEventDispatcher.shared.send(
                    methodOpenAchievementUI,
                    data: SdkResult<Bool>(data: result)
                )
            })
        }, isMain: true)
    }
    
    func getAchievementData(_ data: GetAchievementDataParam?) {
        withActor({
            await handleSdkError(methodGetAchievementData, action: {
                let result = try await GamingService.shared.getAchievementList()
                CocosEventDispatcher.shared.send(
                    methodGetAchievementData,
                    data: SdkResult<[Achievement]>(data: result)
                )
            })
        })
    }
    
    func requestFriendListPermission() {
        withActor({
            await handleSdkError(methodRequestFriendListPermission, action: {
                let result = try await GamingService.shared.requestFriendListPermission()
                CocosEventDispatcher.shared.send(
                    methodRequestFriendListPermission,
                    data: SdkResult<Bool>(data: result)
                )
            })
        }, isMain: true)
    }

    private var friendPageIndex = 1
    
    func loadFriends(_ data: LoadFriendsParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodLoadFriends) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodLoadFriends,
                data: SdkResult<PlayerList>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodLoadFriends, action: {
                let result = try await GamingService.shared.loadFriendList(
                    range: NSRange(self.friendPageIndex..<param.pageSize)
                )
                
                for p in result.friends {
                    let id = p.playerId
                    let exists = self.playerMap.contains(where: { $0.key == id })
                    if (!exists) {
                        self.playerMap[id] = p
                        break
                    }
                }
                
                if result.hasMore {
                    self.friendPageIndex += param.pageSize
                }
                CocosEventDispatcher.shared.send(
                    methodLoadFriends,
                    data: SdkResult<PlayerList>(data: result)
                )
            })
        })
    }
    
    func loadMoreFriends(_ data: LoadMoreFriendsParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodLoadMoreFriends) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodLoadMoreFriends,
                data: SdkResult<PlayerList>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        withActor({
            await handleSdkError(methodLoadMoreFriends, action: {
                let result = try await GamingService.shared.loadFriendList(
                    range: NSRange(self.friendPageIndex..<param.pageSize)
                )
                
                for p in result.friends {
                    let id = p.playerId
                    let exists = self.playerMap.contains(where: { $0.key == id })
                    if (!exists) {
                        self.playerMap[id] = p
                        break
                    }
                }

                if result.hasMore {
                    self.friendPageIndex += param.pageSize
                }
                CocosEventDispatcher.shared.send(
                    methodLoadMoreFriends,
                    data: SdkResult<PlayerList>(data: result)
                )
            })
        })
    }
    
    func openPlayerProfileUI(_ data: OpenPlayerProfileUIParam?) {
        guard let param = data else {
            let msg = "Missing param in calling \(methodOpenPlayerProfileUI) function"
            LoggingService.shared.warn(tag: AthanaCocos.TAG, message: msg)
            CocosEventDispatcher.shared.send(
                methodOpenPlayerProfileUI,
                data: SdkResult<Bool>(error: SdkError(.SDK_REQUEST_ERROR, msg: msg))
            )
            return
        }
        
        guard let player = playerMap[param.playerId] else {
            return
        }
        
        Task {
            await GamingService.shared.openPlayerProfileUI(
                player: player
            )
        }
    }
    
}

struct SubmitScoreParam: Codable {
    let leaderboardId: String
    let score: Int
    let extra: String?
    let immediate: Bool
}

struct GetScoreParam: Codable {
    let leaderboardId: String
    let scope: String
    let timeScope: String
}

struct OpenLeaderboardUIParam: Codable {
    let leaderboardId: String?
    let scope: String?
    let timeScope: String?
}

struct GetLeaderboardInfoParam: Codable {
    let leaderboardId: String?
    let forceReload: Bool
}

struct LoadLeaderboardDataParam: Codable {
    let leaderboardId: String
    let scope: String
    let timeScope: String
    let pageSize: Int
    let userCenter: Bool
}

struct LoadMoreLeaderboardDataParam: Codable {
    let leaderboardId: String
    let pageSize: Int
    let pageDirection: String
}

struct UnlockAchievementParam: Codable {
    let achievementId: String
    let immediate: Bool
}

struct UpdateAchievementProgressParam: Codable {
    let achievementId: String
    let progress: Int
    let immediate: Bool
}

struct GetAchievementDataParam: Codable {
    let forceReload: Bool
}

struct LoadFriendsParam: Codable {
    let pageSize: Int
    let forceReload: Bool
}

struct LoadMoreFriendsParam: Codable {
    let pageSize: Int
}

struct OpenPlayerProfileUIParam: Codable {
    let playerId: String
}

struct GetPlayerProfileParam: Codable {
    let playerId: String
    let forceReload: Bool
}
