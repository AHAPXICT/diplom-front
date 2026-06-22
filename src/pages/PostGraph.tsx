import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3-force';
import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { comments, type Post, type Comment } from '../mockData.ts';

interface PostGraphProps {
    open: boolean;
    onClose: () => void;
    post: Post;
}

interface GraphNode {
    id: string;
    name: string;
    type: 'post' | 'comment';
    color: string;
    imageUrl?: string;
    avatarUrl?: string;
    author?: string;
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
    comment: { w: 160, h: 70, collisionRadius: 140 },
} as const;

const LAYOUT = {
    levelHeight: 220,
    nodeSpacing: 280,
    chargeStrength: -120,
    linkStrength: 0.15,
    linkDistance: 100,
    collisionStrength: 1,
} as const;

const wrapText = (text: string, maxLen: number) =>
    text.match(new RegExp(`.{1,${maxLen}}`, 'g')) || [];

const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
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

const buildGraphData = (post: Post) => {
    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const postId = `post-${post.id}`;

    nodes.push({
        id: postId,
        name: `${post.title.slice(0, 40)}...`,
        type: 'post',
        color: '#1976d2',
        imageUrl: post.imageUrl,
        x: 0,
        y: 0,
        fx: 0,
        fy: 0,
    });

    const addReplies = (list: Comment[], parentId: string, depth = 1, parentX = 0) => {
        list.forEach((comment, i) => {
            const commentId = `comment-${comment.id}`;
            const offset = (i - (list.length - 1) / 2) * LAYOUT.nodeSpacing;
            const x = parentX + offset;
            const y = depth * LAYOUT.levelHeight;

            nodes.push({
                id: commentId,
                name: `${comment.content.slice(0, 50)}...`,
                type: 'comment',
                color: '#dc004e',
                avatarUrl: comment.author.avatar,
                author: comment.author.username,
                x,
                y,
                fx: x,
                fy: y,
            });

            links.push({ source: parentId, target: commentId });

            if (comment.replies?.length) {
                addReplies(comment.replies, commentId, depth + 1, x);
            }
        });
    };

    addReplies(comments[post.id] || [], postId);
    return { nodes, links };
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

const configurePhysics = (fg: any) => {
    fg.d3Force('charge', d3.forceManyBody().strength(LAYOUT.chargeStrength));

    fg.d3Force(
        'link',
        d3
            .forceLink()
            .distance(LAYOUT.linkDistance)
            .strength(LAYOUT.linkStrength),
    );

    fg.d3Force(
        'collision',
        d3.forceCollide((node: any) =>
            node.type === 'post' ? SIZES.post.collisionRadius : SIZES.comment.collisionRadius,
        ).strength(LAYOUT.collisionStrength),
    );

    fg.d3Force(
        'x',
        d3.forceX().x((d: any) => d.fx ?? 0).strength(0.05),
    );
    fg.d3Force(
        'y',
        d3.forceY().y((d: any) => d.fy ?? 0).strength(0.05),
    );
};
const drawPostNode = (
    ctx: CanvasRenderingContext2D,
    node: any,
    x: number,
    y: number,
    w: number,
    h: number,
    fontSize: number,
    imageCache: Map<string, HTMLImageElement>,
) => {
    if (node.imageUrl && imageCache.has(node.imageUrl)) {
        const img = imageCache.get(node.imageUrl)!;
        if (img.complete) {
            ctx.save();
            drawRoundedRect(ctx, x + 5, y + 5, w - 10, 60, 6);
            ctx.clip();
            ctx.drawImage(img, x + 5, y + 5, w - 10, 60);
            ctx.restore();
        }
    }

    // Text
    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize + 1}px Sans-Serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, node.x, y + h - 18);
};

const drawCommentNode = (
    ctx: CanvasRenderingContext2D,
    node: any,
    x: number,
    y: number,
    fontSize: number,
    imageCache: Map<string, HTMLImageElement>,
) => {
    if (node.avatarUrl && imageCache.has(node.avatarUrl)) {
        const img = imageCache.get(node.avatarUrl)!;
        if (img.complete) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + 20, y + 20, 16, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, x + 4, y + 4, 32, 32);
            ctx.restore();
        }
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#9e5d32';
    ctx.font = `bold ${fontSize + 3}px Sans-Serif`;
    ctx.fillText(node.author || 'User', x + 45, y + 16);

    ctx.fillStyle = '#000000';
    ctx.font = `${fontSize + 1}px Sans-Serif`;
    wrapText(node.name, 22)
        .slice(0, 2)
        .forEach((line: string, i: number) => {
            ctx.fillText(line, x + 45, y + 35 + i * 14);
        });
};

export default function PostGraph({ open, onClose, post }: PostGraphProps) {
    const graphRef = useRef<any>(null);
    const graphData = useMemo(() => buildGraphData(post), [post]);
    const imageCache = useImageCache(graphData.nodes);

    useEffect(() => {
        if (!graphRef.current) return;
        configurePhysics(graphRef.current);
    }, [graphData]);

    const drawNode = useCallback(
        (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
            const { w, h } = node.type === 'post' ? SIZES.post : SIZES.comment;
            const x = node.x - w / 2;
            const y = node.y - h / 2;
            const fontSize = 11 / globalScale;

            drawRoundedRect(ctx, x, y, w, h, 8);
            ctx.fillStyle = '#dddddd';
            ctx.fill();
            ctx.strokeStyle = node.color;
            ctx.lineWidth = node.type === 'post' ? 3 : 2;
            ctx.stroke();

            if (node.type === 'post') {
                drawPostNode(ctx, node, x, y, w, h, fontSize, imageCache);
            } else {
                drawCommentNode(ctx, node, x, y, fontSize, imageCache);
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
            PaperProps={{ sx: { bgcolor: '#fff9f9', borderRadius: 3, overflow: 'hidden' } }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#fffbfb',
                    color: '#000000',
                    borderBottom: '1px solid #2a2a2a',
                }}
            >
                Post Connections Graph
                <IconButton onClick={onClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ height: 700, bgcolor: '#ffffff' }}>
                    <ForceGraph2D
                        ref={graphRef}
                        graphData={graphData}
                        backgroundColor="#F0F0F0"
                        nodeCanvasObject={drawNode}
                        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
                            const { w, h } = node.type === 'post' ? SIZES.post : SIZES.comment;
                            ctx.fillStyle = color;
                            ctx.fillRect(node.x - w / 2, node.y - h / 2, w, h);
                        }}
                        linkColor={() => '#404040'}
                        linkWidth={2}
                        d3AlphaDecay={0.02}
                        d3VelocityDecay={0.4}
                        cooldownTicks={300}
                        onEngineStop={() => graphRef.current?.zoomToFit(400, 80)}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
}