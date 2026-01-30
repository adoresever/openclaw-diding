import { z } from 'zod';

/**
 * 钉钉渠道配置 Schema
 *
 * 配置字段说明:
 * - enabled: 是否启用该渠道
 * - clientId: 钉钉应用的 AppKey
 * - clientSecret: 钉钉应用的 AppSecret
 * - dmPolicy: 单聊策略 (open=开放, pairing=配对, allowlist=白名单)
 * - groupPolicy: 群聊策略 (open=开放, allowlist=白名单, disabled=禁用)
 * - requireMention: 群聊是否需要 @机器人
 * - allowFrom: 单聊白名单用户 ID 列表
 * - groupAllowFrom: 群聊白名单会话 ID 列表
 * - historyLimit: 历史消息数量限制
 * - textChunkLimit: 文本分块大小限制
 */
declare const DingtalkConfigSchema: z.ZodObject<{
    /** 是否启用钉钉渠道 */
    enabled: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** 钉钉应用 AppKey (clientId) */
    clientId: z.ZodOptional<z.ZodString>;
    /** 钉钉应用 AppSecret (clientSecret) */
    clientSecret: z.ZodOptional<z.ZodString>;
    /** 单聊策略: open=开放, pairing=配对, allowlist=白名单 */
    dmPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["open", "pairing", "allowlist"]>>>;
    /** 群聊策略: open=开放, allowlist=白名单, disabled=禁用 */
    groupPolicy: z.ZodDefault<z.ZodOptional<z.ZodEnum<["open", "allowlist", "disabled"]>>>;
    /** 群聊是否需要 @机器人才响应 */
    requireMention: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    /** 单聊白名单: 允许的用户 ID 列表 */
    allowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** 群聊白名单: 允许的会话 ID 列表 */
    groupAllowFrom: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** 历史消息数量限制 */
    historyLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    /** 文本分块大小限制 (钉钉单条消息最大 4000 字符) */
    textChunkLimit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    dmPolicy: "open" | "pairing" | "allowlist";
    groupPolicy: "open" | "allowlist" | "disabled";
    requireMention: boolean;
    historyLimit: number;
    textChunkLimit: number;
    clientId?: string | undefined;
    clientSecret?: string | undefined;
    allowFrom?: string[] | undefined;
    groupAllowFrom?: string[] | undefined;
}, {
    enabled?: boolean | undefined;
    clientId?: string | undefined;
    clientSecret?: string | undefined;
    dmPolicy?: "open" | "pairing" | "allowlist" | undefined;
    groupPolicy?: "open" | "allowlist" | "disabled" | undefined;
    requireMention?: boolean | undefined;
    allowFrom?: string[] | undefined;
    groupAllowFrom?: string[] | undefined;
    historyLimit?: number | undefined;
    textChunkLimit?: number | undefined;
}>;
type DingtalkConfig = z.infer<typeof DingtalkConfigSchema>;

/**
 * 发送消息结果
 */
interface DingtalkSendResult {
    /** 消息 ID */
    messageId: string;
    /** 会话 ID */
    conversationId: string;
}
/**
 * 解析后的钉钉账户配置
 * 用于 ChannelPlugin config 适配器
 */
interface ResolvedDingtalkAccount {
    /** 账户 ID */
    accountId: string;
    /** 是否启用 */
    enabled: boolean;
    /** 是否已配置（有凭证） */
    configured: boolean;
    /** 客户端 ID */
    clientId?: string;
}

/**
 * 钉钉出站适配器
 *
 * 实现 ChannelOutboundAdapter 接口，提供:
 * - sendText: 发送文本消息
 * - sendMedia: 发送媒体消息（含回退逻辑）
 * - chunker: 长消息分块（利用 Moltbot 核心的 markdown-aware 分块）
 *
 * 配置:
 * - deliveryMode: "direct" (直接发送，不使用队列)
 * - textChunkLimit: 4000 (钉钉 Markdown 消息最大字符数)
 * - chunkerMode: "markdown" (使用 markdown 感知的分块模式)
 */

/**
 * 出站适配器配置类型
 * 简化版本，仅包含必要字段
 */
interface OutboundConfig {
    channels?: {
        dingtalk?: DingtalkConfig;
    };
}
/**
 * 发送结果类型
 */
interface SendResult {
    channel: string;
    messageId: string;
    chatId?: string;
    conversationId?: string;
}

/** 默认账户 ID */
declare const DEFAULT_ACCOUNT_ID = "default";
/**
 * 配置接口类型（简化版）
 */
interface PluginConfig {
    channels?: {
        dingtalk?: DingtalkConfig;
    };
}
/**
 * 钉钉渠道插件
 *
 * 实现 ChannelPlugin 接口，提供完整的钉钉消息渠道功能
 */
declare const dingtalkPlugin: {
    id: string;
    /**
     * 渠道元数据
     * Requirements: 1.2
     */
    meta: {
        id: "dingtalk";
        label: "DingTalk";
        selectionLabel: "DingTalk (钉钉)";
        docsPath: "/channels/dingtalk";
        docsLabel: "dingtalk";
        blurb: "钉钉企业消息";
        aliases: readonly ["ding"];
        order: 71;
    };
    /**
     * 渠道能力声明
     * Requirements: 1.3
     */
    capabilities: {
        chatTypes: readonly ["direct", "channel"];
        media: boolean;
        reactions: boolean;
        threads: boolean;
        edit: boolean;
        reply: boolean;
        polls: boolean;
    };
    /**
     * 配置 Schema
     * Requirements: 1.4
     */
    configSchema: {
        schema: {
            type: string;
            additionalProperties: boolean;
            properties: {
                enabled: {
                    type: string;
                };
                clientId: {
                    type: string;
                };
                clientSecret: {
                    type: string;
                };
                dmPolicy: {
                    type: string;
                    enum: string[];
                };
                groupPolicy: {
                    type: string;
                    enum: string[];
                };
                requireMention: {
                    type: string;
                };
                allowFrom: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                groupAllowFrom: {
                    type: string;
                    items: {
                        type: string;
                    };
                };
                historyLimit: {
                    type: string;
                    minimum: number;
                };
                textChunkLimit: {
                    type: string;
                    minimum: number;
                };
            };
        };
    };
    /**
     * 配置重载触发器
     */
    reload: {
        configPrefixes: string[];
    };
    /**
     * 账户配置适配器
     * Requirements: 2.1, 2.2, 2.3
     */
    config: {
        /**
         * 列出所有账户 ID
         * Requirements: 2.1
         */
        listAccountIds: (_cfg: PluginConfig) => string[];
        /**
         * 解析账户配置
         * Requirements: 2.2
         */
        resolveAccount: (cfg: PluginConfig, accountId?: string) => ResolvedDingtalkAccount;
        /**
         * 获取默认账户 ID
         */
        defaultAccountId: () => string;
        /**
         * 设置账户启用状态
         */
        setAccountEnabled: (params: {
            cfg: PluginConfig;
            enabled: boolean;
        }) => PluginConfig;
        /**
         * 删除账户配置
         */
        deleteAccount: (params: {
            cfg: PluginConfig;
        }) => PluginConfig;
        /**
         * 检查账户是否已配置
         * Requirements: 2.3
         */
        isConfigured: (_account: ResolvedDingtalkAccount, cfg: PluginConfig) => boolean;
        /**
         * 描述账户信息
         */
        describeAccount: (account: ResolvedDingtalkAccount) => {
            accountId: string;
            enabled: boolean;
            configured: boolean;
        };
        /**
         * 解析白名单
         */
        resolveAllowFrom: (params: {
            cfg: PluginConfig;
        }) => string[];
        /**
         * 格式化白名单条目
         */
        formatAllowFrom: (params: {
            allowFrom: (string | number)[];
        }) => string[];
    };
    /**
     * 安全警告收集器
     */
    security: {
        collectWarnings: (params: {
            cfg: PluginConfig;
        }) => string[];
    };
    /**
     * 设置向导适配器
     */
    setup: {
        resolveAccountId: () => string;
        applyAccountConfig: (params: {
            cfg: PluginConfig;
        }) => PluginConfig;
    };
    /**
     * 出站消息适配器
     * Requirements: 7.1, 7.6
     */
    outbound: {
        deliveryMode: "direct";
        textChunkLimit: number;
        chunkerMode: "markdown";
        chunker: (text: string, limit: number) => string[];
        sendText: (params: {
            cfg: OutboundConfig;
            to: string;
            text: string;
        }) => Promise<SendResult>;
        sendMedia: (params: {
            cfg: OutboundConfig;
            to: string;
            text?: string;
            mediaUrl?: string;
        }) => Promise<SendResult>;
    };
    /**
     * Gateway 连接管理适配器
     * Requirements: 3.1
     */
    gateway: {
        /**
         * 启动账户连接
         * Requirements: 3.1
         */
        startAccount: (ctx: {
            cfg: PluginConfig;
            runtime?: unknown;
            abortSignal?: AbortSignal;
            accountId: string;
            setStatus?: (status: Record<string, unknown>) => void;
            log?: {
                info: (msg: string) => void;
                error: (msg: string) => void;
            };
        }) => Promise<void>;
    };
};

/**
 * 钉钉发送消息 API
 *
 * 提供:
 * - sendMessageDingtalk: 发送 Markdown 消息（单聊/群聊）
 *
 * API 文档:
 * - 单聊: https://open.dingtalk.com/document/orgapp/chatbots-send-one-on-one-chat-messages-in-batches
 * - 群聊: https://open.dingtalk.com/document/orgapp/the-robot-sends-a-group-message
 */

/**
 * 发送消息参数
 */
interface SendMessageParams {
    /** 钉钉配置 */
    cfg: DingtalkConfig;
    /** 目标 ID（用户 ID 或会话 ID） */
    to: string;
    /** 消息文本内容 */
    text: string;
    /** 聊天类型 */
    chatType: "direct" | "group";
    /** Markdown 消息标题（可选） */
    title?: string;
}
/**
 * 发送 Markdown 消息到钉钉
 *
 * 根据 chatType 调用不同的 API:
 * - direct: /v1.0/robot/oToMessages/batchSend (单聊批量发送)
 * - group: /v1.0/robot/groupMessages/send (群聊发送)
 *
 * 始终使用 sampleMarkdown 模板，支持表格、代码块等格式
 *
 * @param params 发送参数
 * @returns 发送结果
 * @throws Error 如果凭证未配置或 API 调用失败
 */
declare function sendMessageDingtalk(params: SendMessageParams): Promise<DingtalkSendResult>;

/**
 * 钉钉插件运行时管理
 *
 * 提供对 Moltbot 核心运行时的访问。
 *
 * 重要：这个模块存储完整的 PluginRuntime，包含 core.channel.routing、
 * core.channel.reply 等 API，用于消息分发到 Agent。
 *
 * 使用方式：
 * 1. 插件注册时调用 setDingtalkRuntime(runtime) 设置完整 runtime
 * 2. 消息处理时调用 getDingtalkRuntime() 获取 runtime 进行分发
 */
/**
 * Moltbot 插件运行时接口
 *
 * 包含 Moltbot 核心 API，用于：
 * - 路由解析 (channel.routing.resolveAgentRoute)
 * - 消息分发 (channel.reply.dispatchReplyFromConfig)
 * - 系统事件 (system.enqueueSystemEvent)
 */
interface PluginRuntime {
    /** 日志函数 */
    log?: (msg: string) => void;
    /** 错误日志函数 */
    error?: (msg: string) => void;
    /** Moltbot 核心 API */
    channel?: {
        routing?: {
            resolveAgentRoute?: (params: {
                cfg: unknown;
                channel: string;
                peer: {
                    kind: string;
                    id: string;
                };
            }) => {
                sessionKey: string;
                accountId: string;
                agentId?: string;
            };
        };
        reply?: {
            dispatchReplyFromConfig?: (params: {
                ctx: unknown;
                cfg: unknown;
                dispatcher?: unknown;
                replyOptions?: unknown;
            }) => Promise<{
                queuedFinal: boolean;
                counts: {
                    final: number;
                };
            }>;
            finalizeInboundContext?: (ctx: unknown) => unknown;
            createReplyDispatcher?: (params: unknown) => unknown;
            createReplyDispatcherWithTyping?: (params: unknown) => {
                dispatcher: unknown;
                replyOptions?: unknown;
                markDispatchIdle?: () => void;
            };
            resolveHumanDelayConfig?: (cfg: unknown, agentId?: string) => unknown;
            resolveEnvelopeFormatOptions?: (cfg: unknown) => unknown;
            formatAgentEnvelope?: (params: unknown) => string;
        };
        text?: {
            resolveTextChunkLimit?: (params: {
                cfg: unknown;
                channel: string;
                defaultLimit?: number;
            }) => number;
            resolveChunkMode?: (cfg: unknown, channel: string) => unknown;
            resolveMarkdownTableMode?: (params: {
                cfg: unknown;
                channel: string;
            }) => unknown;
            convertMarkdownTables?: (text: string, mode: unknown) => string;
            chunkTextWithMode?: (text: string, limit: number, mode: unknown) => string[];
            /** Markdown 感知的文本分块，不会在代码块中间断开 */
            chunkMarkdownText?: (text: string, limit: number) => string[];
        };
    };
    system?: {
        enqueueSystemEvent?: (message: string, options?: unknown) => void;
    };
    [key: string]: unknown;
}
/**
 * 设置钉钉插件运行时
 *
 * 在插件注册时由 Moltbot 调用，传入完整的 PluginRuntime。
 *
 * @param next Moltbot 插件运行时实例（完整版，包含 core API）
 */
declare function setDingtalkRuntime(next: PluginRuntime): void;
/**
 * 获取钉钉插件运行时
 *
 * 在消息处理时调用，获取完整的 runtime 用于分发消息到 Agent。
 *
 * @returns Moltbot 插件运行时实例
 * @throws Error 如果运行时未初始化（插件未正确注册）
 */
declare function getDingtalkRuntime(): PluginRuntime;

/**
 * @moltbot-china/dingtalk
 * 钉钉渠道插件入口
 *
 * 导出:
 * - dingtalkPlugin: ChannelPlugin 实现
 * - sendMessageDingtalk: 发送消息函数
 * - DEFAULT_ACCOUNT_ID: 默认账户 ID
 *
 * Requirements: 1.1
 */
/**
 * Moltbot 插件 API 接口
 *
 * 包含：
 * - registerChannel: 注册渠道插件
 * - runtime: 完整的 Moltbot 运行时（包含 core API）
 */
interface MoltbotPluginApi {
    registerChannel: (opts: {
        plugin: unknown;
    }) => void;
    /** Moltbot 运行时，包含 channel.routing、channel.reply 等核心 API */
    runtime?: unknown;
    [key: string]: unknown;
}

/**
 * 钉钉插件定义
 *
 * 包含:
 * - id: 插件标识符
 * - name: 插件名称
 * - description: 插件描述
 * - configSchema: 配置 JSON Schema
 * - register: 注册函数，调用 api.registerChannel 并设置 runtime
 *
 * Requirements: 1.1
 */
declare const plugin: {
    id: string;
    name: string;
    description: string;
    configSchema: {
        type: string;
        additionalProperties: boolean;
        properties: {
            enabled: {
                type: string;
            };
            clientId: {
                type: string;
            };
            clientSecret: {
                type: string;
            };
            dmPolicy: {
                type: string;
                enum: string[];
            };
            groupPolicy: {
                type: string;
                enum: string[];
            };
            requireMention: {
                type: string;
            };
            allowFrom: {
                type: string;
                items: {
                    type: string;
                };
            };
            groupAllowFrom: {
                type: string;
                items: {
                    type: string;
                };
            };
            historyLimit: {
                type: string;
                minimum: number;
            };
            textChunkLimit: {
                type: string;
                minimum: number;
            };
        };
    };
    /**
     * 注册钉钉渠道插件
     *
     * 1. 设置完整的 Moltbot 运行时（包含 core API）
     * 2. 调用 api.registerChannel 将 dingtalkPlugin 注册到 Moltbot
     *
     * Requirements: 1.1
     */
    register(api: MoltbotPluginApi): void;
};

export { DEFAULT_ACCOUNT_ID, type DingtalkConfig, type DingtalkSendResult, type MoltbotPluginApi, type ResolvedDingtalkAccount, plugin as default, dingtalkPlugin, getDingtalkRuntime, sendMessageDingtalk, setDingtalkRuntime };
