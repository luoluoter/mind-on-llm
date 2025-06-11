import { useState, useEffect } from 'react';

function parseMermaidToSVG(mermaidText) {
  try {
    // 简单的解析器，将 mermaid 文本转换为 SVG 路径
    const lines = mermaidText.split('\n');
    const nodes = [];
    const edges = [];
    let currentY = 50;
    const nodeHeight = 60;
    const nodeWidth = 150;
    const levelGap = 100;

    // 解析节点和边
    lines.forEach(line => {
      if (line.includes('-->')) {
        const [from, to] = line.split('-->').map(s => s.trim());
        edges.push({ from, to });
      } else if (line.includes('[') && line.includes(']')) {
        const content = line.match(/\[(.*?)\]/)[1];
        const id = line.split('[')[0].trim();
        nodes.push({ id, content });
      }
    });

    // 如果没有节点，返回默认尺寸
    if (nodes.length === 0) {
      return {
        width: 400,
        height: 200,
        nodes: [],
        edges: []
      };
    }

    // 计算节点位置
    const nodePositions = {};
    const levels = new Map(); // 用于存储每个层级的节点
    
    // 第一层节点
    const rootNodes = nodes.filter(node => !edges.some(edge => edge.to === node.id));
    rootNodes.forEach((node, index) => {
      nodePositions[node.id] = {
        x: 50 + index * (nodeWidth + 50),
        y: currentY
      };
      levels.set(node.id, 0);
    });

    // 计算其他层节点位置
    let maxLevel = 0;
    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        const fromLevel = levels.get(edge.from) || 0;
        const toLevel = fromLevel + 1;
        levels.set(edge.to, toLevel);
        maxLevel = Math.max(maxLevel, toLevel);
      }
    });

    // 按层级组织节点
    const nodesByLevel = Array.from({ length: maxLevel + 1 }, () => []);
    nodes.forEach(node => {
      const level = levels.get(node.id) || 0;
      nodesByLevel[level].push(node);
    });

    // 计算每个层级的节点位置
    nodesByLevel.forEach((levelNodes, levelIndex) => {
      const levelWidth = levelNodes.length * (nodeWidth + 50);
      const startX = Math.max(50, (Math.max(...Object.values(nodePositions).map(pos => pos.x)) - levelWidth) / 2);
      
      levelNodes.forEach((node, index) => {
        nodePositions[node.id] = {
          x: startX + index * (nodeWidth + 50),
          y: currentY + levelIndex * (nodeHeight + levelGap)
        };
      });
    });

    // 计算 SVG 尺寸
    const positions = Object.values(nodePositions);
    const maxX = Math.max(...positions.map(pos => pos.x));
    const maxY = Math.max(...positions.map(pos => pos.y));
    
    // 确保最小尺寸
    const svgWidth = Math.max(400, maxX + nodeWidth + 100);
    const svgHeight = Math.max(200, maxY + nodeHeight + 100);

    return {
      width: svgWidth,
      height: svgHeight,
      nodes: nodes.map(node => ({
        ...node,
        position: nodePositions[node.id] || { x: 0, y: 0 }
      })),
      edges: edges.map(edge => ({
        ...edge,
        from: nodePositions[edge.from] || { x: 0, y: 0 },
        to: nodePositions[edge.to] || { x: 0, y: 0 }
      }))
    };
  } catch (error) {
    console.error('解析决策树数据失败:', error);
    return {
      width: 400,
      height: 200,
      nodes: [],
      edges: []
    };
  }
}

export function DecisionTree({ treeData }) {
  const [tree, setTree] = useState(null);
  const [error, setError] = useState(null);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (treeData) {
      try {
        const parsedTree = parseMermaidToSVG(treeData);
        if (parsedTree) {
          setTree(parsedTree);
          setError(null);
          // 重置动画步骤
          setAnimationStep(0);
        } else {
          setError('无法解析决策树数据');
        }
      } catch (err) {
        setError('解析决策树数据时出错');
        console.error(err);
      }
    }
  }, [treeData]);

  // 动画效果
  useEffect(() => {
    if (tree && tree.nodes.length > 0) {
      const interval = setInterval(() => {
        setAnimationStep(prev => {
          if (prev >= tree.nodes.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 300); // 每300ms显示一个新节点

      return () => clearInterval(interval);
    }
  }, [tree]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">渲染错误</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <svg width={tree.width} height={tree.height} className="w-full">
        {/* 绘制边 */}
        {tree.edges.map((edge, index) => {
          if (!edge.from || !edge.to) return null;
          
          const isVisible = tree.nodes.findIndex(node => node.id === edge.to) < animationStep;
          
          return (
            <path
              key={`edge-${index}`}
              d={`M ${edge.from.x + 75} ${edge.from.y + 60} 
                  L ${edge.to.x + 75} ${edge.to.y}`}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            />
          );
        })}

        {/* 绘制节点 */}
        {tree.nodes.map((node, index) => {
          if (!node.position) return null;
          
          const isVisible = index < animationStep;
          
          return (
            <g 
              key={`node-${index}`} 
              transform={`translate(${node.position.x}, ${node.position.y})`}
              className={`transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <rect
                width={150}
                height={60}
                rx="8"
                fill="white"
                stroke="#94a3b8"
                strokeWidth="2"
                className="transition-colors duration-300 hover:stroke-indigo-500"
              />
              <text
                x={75}
                y={30}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-sm fill-gray-700"
              >
                {node.content.split('<br>').map((line, i) => (
                  <tspan
                    key={i}
                    x={75}
                    dy={i === 0 ? 0 : 20}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
} 