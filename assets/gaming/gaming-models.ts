/**
 * 排行榜玩家范围
 */
export enum LeaderboardPlayerScope {
    /**
     * 公开（所有玩家）
     */
    ALL = "ALL",

    /**
     * 社交（仅好友）
     */
    FRIENDS = "FRIENDS"
}

/**
 * 排行榜时间范围
 */
export enum LeaderboardTimeSpan {
    /**
     * 所有时间
     */
    ALL_TIME = "ALL_TIME",

    /**
     * 每周
     */
    WEEK = "WEEK",

    /**
     * 每日
     */
    TODAY = "TODAY"
}

/**
 * 分页方向
 */
export enum PageDirection {
    /**
     * 下一页
     */
    NEXT = "NEXT",

    /**
     * 上一页
     */
    PREV = "PREV"
}

/**
 * 成就类型
 */
export enum AchievementType {
    /**
     * 普通成就（一次性解锁）
     */
    NORMAL = "NORMAL",

    /**
     * 增量成就（需要逐步完成）
     */
    INCREMENTAL = "INCREMENTAL"
}

/**
 * 成就状态
 */
export enum AchievementState {
    /**
     * 隐藏（未显示给玩家）
     */
    HIDDEN = "HIDDEN",

    /**
     * 可见（已显示但未解锁）
     */
    VISIBLE = "VISIBLE",

    /**
     * 已解锁
     */
    UNLOCKED = "UNLOCKED"
}

/**
 * 排行榜信息
 */
export class LeaderboardInfo {
    /**
     * 排行榜 ID
     */
    public leaderboardId: string;

    /**
     * 排行榜名称
     */
    public name: string;

    /**
     * 排行榜图片 URL
     */
    public imageUrl?: string;

    constructor(leaderboardId: string, name: string, imageUrl?: string) {
        this.leaderboardId = leaderboardId;
        this.name = name;
        this.imageUrl = imageUrl;
    }
}

/**
 * 分数数据
 */
export class ScoreData {
    /**
     * 排名
     */
    public rank: number;

    /**
     * 分数
     */
    public score: number;

    /**
     * 格式化分数
     */
    public displayScore: string;

    /**
     * 玩家信息
     */
    public player?: PlayerProfile;

    /**
     * 分数额外信息
     */
    public extraInfo?: ScoreExtraInfo;

    constructor(rank: number, score: number, displayScore: string, player?: PlayerProfile, extraInfo?: ScoreExtraInfo) {
        this.rank = rank;
        this.score = score;
        this.displayScore = displayScore;
        this.player = player;
        this.extraInfo = extraInfo;
    }
}

/**
 * 分数额外信息
 */
export class ScoreExtraInfo {

    /**
     * 时间戳
     */
    public timestamp?: number;

    /**
     * 格式化排名
     */
    public formatterRank?: string;

    /**
     * 扩展信息
     */
    public tag?: string;

    constructor(timestamp?: number, formatterRank?: string, tag?: string) {
        this.timestamp = timestamp;
        this.formatterRank = formatterRank;
        this.tag = tag;
    }
}

/**
 * 分数列表
 */
export class ScoreList {
    /**
     * 分数数据列表
     */
    public scoreList: ScoreData[];

    /**
     * 是否有下一页
     */
    public hasMore: boolean;

    constructor(scoreList: ScoreData[], hasMore: boolean) {
        this.scoreList = scoreList;
        this.hasMore = hasMore;
    }
}

/**
 * 成就信息
 */
export class Achievement {
    /**
     * 成就 ID
     */
    public achievementId: string;

    /**
     * 成就名称
     */
    public title: string;

    /**
     * 成就描述
     */
    public description?: string;

    /**
     * 成就类型
     */
    public type: AchievementType;

    /**
     * 成就状态
     */
    public state: AchievementState;

    /**
     * 当前进度（增量成就有效）
     */
    public progress?: number;

    /**
     * 扩展信息
     */
    public extraInfo?: AchievementExtraInfo;

    constructor(
        achievementId: string,
        title: string,
        type: AchievementType,
        state: AchievementState,
        progress?: number,
        extraInfo?: AchievementExtraInfo
    ) {
        this.achievementId = achievementId;
        this.title = title;
        this.type = type;
        this.state = state;
        this.progress = progress;
        this.extraInfo = extraInfo;
    }
}

/**
 * 成就额外信息
 */
export class AchievementExtraInfo {

    /**
     * 最大进度（增量成就有效）
     */
    public maxValue?: number;

    /**
     * 当前进度（增量成就有效）
     */
    public currentValue?: number;

    /**
     * 格式化最大进度（增量成就有效）
     */
    public formattedMaxValue?: string;

    /**
     * 格式化当前进度（增量成就有效）
     */
    public formattedCurrentValue?: string;
    
    constructor(
        maxValue?: number,
        currentValue?: number,
        formattedMaxValue?: string,
        formattedCurrentValue?: string
    ) {
        this.maxValue = maxValue;
        this.currentValue = currentValue;
        this.formattedMaxValue = formattedMaxValue;
        this.formattedCurrentValue = formattedCurrentValue;
    }
}

/**
 * 玩家信息
 */
export class PlayerProfile {
    /**
     * 玩家 ID
     */
    public playerId: string;

    /**
     * 玩家昵称
     */
    public playerName: string;

    /**
     * 头像 URL
     */
    public avatarUrl?: string;

    constructor(playerId: string, playerName: string, avatarUrl?: string) {
        this.playerId = playerId;
        this.playerName = playerName;
        this.avatarUrl = avatarUrl;
    }
}

/**
 * 提交分数参数
 */
export class SubmitScoreParam {
    /**
     * 排行榜 ID
     */
    public leaderboardId: string;

    /**
     * 分数
     */
    public score: number;

    /**
     * 额外参数
     */
    public extra?: string;

    /**
     * 是否立即提交，false 为异步提交
     */
    public immediate: boolean;

    constructor(leaderboardId: string, score: number, extra?: string, immediate: boolean = false) {
        this.leaderboardId = leaderboardId;
        this.score = score;
        this.extra = extra;
        this.immediate = immediate;
    }
}

/**
 * 获取分数参数
 */
export class GetScoreParam {
    /**
     * 排行榜 ID
     */
    public leaderboardId: string;

    /**
     * 玩家范围
     */
    public scope: LeaderboardPlayerScope;

    /**
     * 时间范围
     */
    public timeScope: LeaderboardTimeSpan;

    constructor(leaderboardId: string, scope: LeaderboardPlayerScope, timeScope: LeaderboardTimeSpan) {
        this.leaderboardId = leaderboardId;
        this.scope = scope;
        this.timeScope = timeScope;
    }
}

/**
 * 打开排行榜 UI 参数
 */
export class OpenLeaderboardUIParam {
    /**
     * 排行榜 ID
     */
    public leaderboardId?: string;

    /**
     * 玩家范围
     */
    public scope?: LeaderboardPlayerScope;

    /**
     * 时间范围
     */
    public timeScope?: LeaderboardTimeSpan;

    constructor(leaderboardId?: string, scope?: LeaderboardPlayerScope, timeScope?: LeaderboardTimeSpan) {
        this.leaderboardId = leaderboardId;
        this.scope = scope;
        this.timeScope = timeScope;
    }
}

/**
 * 获取排行榜信息参数
 */
export class GetLeaderboardInfoParam {
    /**
     * 排行榜 ID
     */
    public leaderboardId?: string;

    /**
     * 是否强制刷新
     */
    public forceReload: boolean;

    constructor(leaderboardId?: string, forceReload: boolean = false) {
        this.leaderboardId = leaderboardId;
        this.forceReload = forceReload;
    }
}

/**
 * 加载排行榜数据参数
 */
export class LoadLeaderboardDataParam {
    /**
     * 排行榜 ID
     */
    public leaderboardId: string;

    /**
     * 玩家范围
     */
    public scope: LeaderboardPlayerScope;

    /**
     * 时间范围
     */
    public timeScope: LeaderboardTimeSpan;

    /**
     * 每页数量
     */
    public pageSize: number;

    /**
     * 是否以当前用户为中心
     */
    public userCenter: boolean;

    constructor(
        leaderboardId: string,
        scope: LeaderboardPlayerScope,
        timeScope: LeaderboardTimeSpan,
        pageSize: number,
        userCenter: boolean = false
    ) {
        this.leaderboardId = leaderboardId;
        this.scope = scope;
        this.timeScope = timeScope;
        this.pageSize = pageSize;
        this.userCenter = userCenter;
    }
}

/**
 * 加载更多排行榜数据参数
 */
export class LoadMoreLeaderboardDataParam {
    /**
     * 排行榜 ID
     */
    public leaderboardId: string;

    /**
     * 每页数量
     */
    public pageSize: number;

    /**
     * 分页方向
     */
    public pageDirection: PageDirection;

    constructor(leaderboardId: string, pageSize: number, pageDirection: PageDirection) {
        this.leaderboardId = leaderboardId;
        this.pageSize = pageSize;
        this.pageDirection = pageDirection;
    }
}

/**
 * 更新成就进度参数
 */
export class UpdateAchievementProgressParam {
    /**
     * 成就 ID
     */
    public achievementId: string;

    /**
     * 进度值
     */
    public progress: number;

    /**
     * 是否立即提交，false 为异步提交
     */
    public immediate: boolean;

    constructor(achievementId: string, progress: number, immediate: boolean = false) {
        this.achievementId = achievementId;
        this.progress = progress;
        this.immediate = immediate;
    }
}

/**
 * 加载好友参数
 */
export class LoadFriendsParam {
    /**
     * 每页数量
     */
    public pageSize: number;

    /**
     * 是否强制刷新
     */
    public forceReload: boolean;

    constructor(pageSize: number, forceReload: boolean = false) {
        this.pageSize = pageSize;
        this.forceReload = forceReload;
    }
}

/**
 * 解锁成就参数
 */
export class UnlockAchievementParam {
    /**
     * 成就 ID
     */
    public achievementId: string;

    /**
     * 是否立即提交，false 为异步提交
     */
    public immediate: boolean;

    constructor(achievementId: string, immediate: boolean = false) {
        this.achievementId = achievementId;
        this.immediate = immediate;
    }
}

/**
 * 好友列表
 */
export class FriendList {
    /**
     * 玩家列表
     */
    public friends: PlayerProfile[];

    /**
     * 是否有更多数据，false 表示已加载完所有数据
     */
    public hasMore: boolean;

    constructor(friends: PlayerProfile[], hasMore: boolean) {
        this.friends = friends;
        this.hasMore = hasMore;
    }
}