import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3-force';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, CircularProgress, Typography } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { api } from '../api.ts';

const API_URL = import.meta.env.VITE_API_URL;

interface PostGraphProps {
    open: boolean;
    onClose: () => void;
    postId: number;
}

interface GraphNode {
    id: string;
    name: string;
    type: 'post' | 'reply' | 'comment';
    color: string;
    imageUrl?: string;
    avatarUrl?: string;
    author?: string;
    postId?: number;
    x?: number;
    y?: number;
    fx?: number;
    fy?: number;
}

interface GraphLink {
    source: string;
    target: string;
}

const SIZES = {
    post: { w: 180, h: 100, collisionRadius: 170 },
    reply: { w: 160, h: 80, collisionRadius: 140 },
    comment: { w: 140, h: 60, collisionRadius: 120 },
} as const;

const LAYOUT = {
    levelHeight: 200,
    nodeSpacing: 250,
    chargeStrength: -150,
    linkStrength: 0.1,
    linkDistance: 80,
    collisionStrength: 0.8,
} as const;

const wrapText = (text: string, maxLen: number) =>
    text?.match(new RegExp(`.{1,${maxLen}}`, 'g')) || [];

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
};

const getImgUrl = (path: string | null | undefined) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    return API_URL + path;
};

const buildGraphData = (data: any) => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeIds = new Set<string>();

    const addNode = (node: GraphNode) => {
        if (!nodeIds.has(node.id)) {
            nodeIds.add(node.id);
            nodes.push(node);
        }
    };

    const addLink = (source: string, target: string) => {
        if (nodeIds.has(source) && nodeIds.has(target)) {
            links.push({ source, target });
        }
    };

    // Рекурсивное добавление комментариев
    const addCommentNodes = (comments: any[], parentId: string, linkedPostId: number, depth: number, parentX: number) => {
        if (!comments?.length) return;
        comments.forEach((comment: any, i: number) => {
            if (!comment?.id) return;
            const commentId = `comment-${comment.id}`;
            const offset = (i - (comments.length - 1) / 2) * LAYOUT.nodeSpacing * 0.6;
            const x = parentX + offset;
            const y = depth * LAYOUT.levelHeight;

            addNode({
                id: commentId,
                name: comment.content?.slice(0, 50) || 'Comment',
                type: 'comment',
                color: '#dc004e',
                author: comment.author?.username,
                avatarUrl: getImgUrl(comment.author?.profilePicture),
                postId: linkedPostId,
            });

            addLink(parentId, commentId);

            // Рекурсивно добавляем replies
            if (comment.replies?.length) {
                addCommentNodes(comment.replies, commentId, linkedPostId, depth + 1, x);
            }
        });
    };

    // Центральный пост
    const postId = `post-${data.id}`;
    addNode({
        id: postId,
        name: data.title || data.description?.slice(0, 40) || 'Post',
        type: 'post',
        color: '#1976d2',
        imageUrl: getImgUrl(data.image),
        author: data.author?.username,
        avatarUrl: getImgUrl(data.author?.profilePicture),
        postId: data.id,
    });

    // Родительский пост
    if (data.parentPost) {
        const parentId = `post-${data.parentPost.id}`;
        addNode({
            id: parentId,
            name: data.parentPost.title || data.parentPost.description?.slice(0, 40) || 'Parent Post',
            type: 'post',
            color: '#ff9800',
            imageUrl: getImgUrl(data.parentPost.image),
            author: data.parentPost.author?.username,
            avatarUrl: getImgUrl(data.parentPost.author?.profilePicture),
            postId: data.parentPost.id,
        });
        addLink(parentId, postId);
    }

    // Реплаи (посты-ответы)
    if (data.replies?.length) {
        data.replies.forEach((reply: any, i: number) => {
            if (!reply?.id) return;
            const replyId = `reply-${reply.id}`;
            const offset = (i - (data.replies.length - 1) / 2) * LAYOUT.nodeSpacing;

            addNode({
                id: replyId,
                name: reply.title || reply.description?.slice(0, 40) || 'Reply',
                type: 'reply',
                color: '#388e3c',
                imageUrl: getImgUrl(reply.image),
                author: reply.author?.username,
                avatarUrl: getImgUrl(reply.author?.profilePicture),
                postId: reply.id,
            });

            addLink(postId, replyId);

            // Комментарии к реплаю
            if (reply.Comment?.length) {
                addCommentNodes(reply.Comment, replyId, reply.id, 2, offset);
            }
        });
    }

    // Комментарии к центральному посту
    if (data.Comment?.length) {
        addCommentNodes(data.Comment, postId, data.id, 1, 0);
    }

    return { nodes, links };
};

const configurePhysics = (fg: any) => {
    fg.d3Force('charge', d3.forceManyBody().strength(LAYOUT.chargeStrength));
    fg.d3Force('link', d3.forceLink().distance(LAYOUT.linkDistance).strength(LAYOUT.linkStrength));
    fg.d3Force('collision', d3.forceCollide((node: any) =>
        node.type === 'post' ? SIZES.post.collisionRadius :
            node.type === 'reply' ? SIZES.reply.collisionRadius :
                SIZES.comment.collisionRadius
    ).strength(LAYOUT.collisionStrength));
    fg.d3Force('x', d3.forceX().x((d: any) => d.fx ?? 0).strength(0.05));
    fg.d3Force('y', d3.forceY().y((d: any) => d.fy ?? 0).strength(0.05));
};

const useImageCache = (nodes: GraphNode[]) => {
    const [cache] = useState(() => new Map<string, HTMLImageElement>());
    useEffect(() => {
        nodes.forEach(({ imageUrl, avatarUrl }) => {
            const src = imageUrl || avatarUrl;
            if (src && !cache.has(src)) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.src = src;
                cache.set(src, img);
            }
        });
    }, [nodes, cache]);
    return cache;
};

export default function PostGraph({ open, onClose, postId }: PostGraphProps) {
    const graphRef = useRef<any>(null);
    const navigate = useNavigate();
    const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const imageCache = useImageCache(graphData?.nodes || []);

    useEffect(() => {
        if (!open || !postId) return;

        const fetchGraph = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`/posts/graph/${postId}`);
                setGraphData(buildGraphData(data));
            } catch (err) {
                console.error('Graph fetch error:', err);
                setGraphData({ nodes: [], links: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchGraph();
    }, [open, postId]);

    useEffect(() => {
        if (!graphRef.current || !graphData?.nodes.length) return;
        configurePhysics(graphRef.current);
    }, [graphData]);

    const handleNodeClick = useCallback((node: any) => {
        if (node.postId) {
            onClose();
            navigate(`/posts/${node.postId}`);
        }
    }, [navigate, onClose]);

    const drawNode = useCallback(
        (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const size = node.type === 'post' ? SIZES.post : node.type === 'reply' ? SIZES.reply : SIZES.comment;
            const { w, h } = size;
            const x = node.x - w / 2;
            const y = node.y - h / 2;
            const fontSize = 10 / globalScale;

            drawRoundedRect(ctx, x, y, w, h, 8);
            ctx.fillStyle = node.color === '#ff9800' ? '#fff3e0' : '#ffffff';
            ctx.fill();
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Безопасное рисование картинки
            const drawSafeImage = (imgSrc: string | undefined, drawFn: (img: HTMLImageElement) => void) => {
                if (!imgSrc || !imageCache.has(imgSrc)) return;
                const img = imageCache.get(imgSrc)!;
                if (img.complete && img.naturalWidth > 0) {
                    try {
                        drawFn(img);
                    } catch (e) {
                        // картинка битая — игнорируем
                    }
                }
            };

            if (node.type === 'post') {
                drawSafeImage(node.imageUrl, (img) => {
                    ctx.save();
                    drawRoundedRect(ctx, x + 5, y + 5, w - 10, 50, 4);
                    ctx.clip();
                    ctx.drawImage(img, x + 5, y + 5, w - 10, 50);
                    ctx.restore();
                });

                if (!node.imageUrl) {
                    drawSafeImage(node.avatarUrl, (img) => {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(x + w / 2, y + 30, 22, 0, Math.PI * 2);
                        ctx.closePath();
                        ctx.clip();
                        ctx.drawImage(img, x + w / 2 - 22, y + 8, 44, 44);
                        ctx.restore();
                    });
                }

                if (node.author) {
                    ctx.fillStyle = '#666';
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.fillText(node.author, node.x, y + 65);
                }
                ctx.fillStyle = '#000';
                ctx.font = `bold ${fontSize + 1}px Sans-Serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                wrapText(node.name, 22).slice(0, 2).forEach((line: string, i: number) => {
                    ctx.fillText(line, node.x, y + h - 20 + i * 14);
                });
            } else if (node.type === 'reply') {
                drawSafeImage(node.avatarUrl, (img) => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x + 25, y + 25, 18, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, x + 7, y + 7, 36, 36);
                    ctx.restore();
                });
                ctx.fillStyle = '#333';
                ctx.font = `bold ${fontSize}px Sans-Serif`;
                ctx.textAlign = 'left';
                ctx.fillText(node.author || '', x + 50, y + 18);
                ctx.fillStyle = '#000';
                ctx.font = `${fontSize}px Sans-Serif`;
                wrapText(node.name, 20).slice(0, 2).forEach((line: string, i: number) => {
                    ctx.fillText(line, x + 50, y + 38 + i * 13);
                });
            } else {
                drawSafeImage(node.avatarUrl, (img) => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(x + 20, y + 20, 14, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, x + 6, y + 6, 28, 28);
                    ctx.restore();
                });
                ctx.fillStyle = '#333';
                ctx.font = `bold ${fontSize}px Sans-Serif`;
                ctx.textAlign = 'left';
                ctx.fillText(node.author || '', x + 40, y + 14);
                ctx.fillStyle = '#000';
                ctx.font = `${fontSize}px Sans-Serif`;
                wrapText(node.name, 18).slice(0, 2).forEach((line: string, i: number) => {
                    ctx.fillText(line, x + 40, y + 30 + i * 12);
                });
            }
        },
        [imageCache],
    );

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{ sx: { bgcolor: '#f5f5f5', borderRadius: 3, overflow: 'hidden' } }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Discussion Graph
                <IconButton onClick={onClose}><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={700}>
                        <CircularProgress />
                    </Box>
                ) : graphData && graphData.nodes.length > 0 ? (
                    <Box sx={{ height: 700 }}>
                        <ForceGraph2D
                            ref={graphRef}
                            graphData={graphData}
                            backgroundColor="#f0f0f0"
                            nodeCanvasObject={drawNode}
                            nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                                const size = node.type === 'post' ? SIZES.post :
                                    node.type === 'reply' ? SIZES.reply : SIZES.comment;
                                ctx.fillStyle = color;
                                ctx.fillRect(node.x - size.w / 2, node.y - size.h / 2, size.w, size.h);
                            }}
                            linkColor={() => '#888'}
                            linkWidth={1.5}
                            d3AlphaDecay={0.02}
                            d3VelocityDecay={0.4}
                            cooldownTicks={200}
                            onNodeClick={handleNodeClick}
                        />
                    </Box>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height={700}>
                        <Typography>Нет данных для отображения</Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
}