import React, { useState, useRef, useMemo } from 'react';
import { X } from 'lucide-react';

const DetailView = ({ data, onClose }) => {
  if (!data) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 bg-white rounded-3xl shadow-xl p-6 z-50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-blue-500">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <rect width="20" height="20" x="2" y="2" rx="5" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-xl font-semibold">{data.name}</h2>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }} 
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M18 21a6 6 0 00-12 0"/>
            </svg>
            <h3 className="font-medium">Global Leader</h3>
          </div>
          <p className="text-gray-500 ml-7">TBD</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M18 21a6 6 0 00-12 0"/>
            </svg>
            <h3 className="font-medium">Key Contacts</h3>
          </div>
          <p className="text-gray-500 italic ml-7">Region Leaders TBA</p>
        </div>

        {data.components && (
          <div className="space-y-2">
            <h3 className="font-medium">Components</h3>
            <div className="space-y-2">
              {data.components.map((component, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  {component}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.marketPresence && (
          <div className="space-y-2">
            <h3 className="font-medium">Market Presence</h3>
            <div className="flex flex-wrap gap-2">
              {data.marketPresence.map((market, index) => (
                <span
                  key={index}
                  className={`px-4 py-1 rounded-lg text-sm ${
                    market === 'Global' ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  {market}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const RadialTree = () => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState(null);
  const backgroundRef = useRef(null);

  const { nodes, nodeDetails } = useMemo(() => {
    const details = {
      "Cloud": {
        name: "Cloud",
        components: ["Cloud Strategy", "Cloud Migration", "Cloud Native Development"],
        marketPresence: ["Global", "US", "UKI", "Canada", "France", "Germany"]
      },
      "Enterprise Services (ADAI)": {
        name: "Enterprise Services",
        components: ["Application Development", "AI Integration", "Digital Transformation"],
        marketPresence: ["Global", "US", "UKI", "France", "Germany"]
      },
      "Data and AI": {
        name: "Data and AI",
        components: ["Data Strategy", "AI/ML Solutions", "Analytics Platform"],
        marketPresence: ["Global", "US", "UKI", "France"]
      },
      "Enterprise Transformation: EA, PPM, Change, Transformation, IT Strategy, Process, Bridge Insights": {
        name: "Enterprise Transformation",
        components: [
          "EA (Enterprise Architecture)",
          "PPM (Project Portfolio Management)",
          "Change Management",
          "Transformation",
          "IT Strategy",
          "Process",
          "Bridge Insights"
        ],
        marketPresence: ["Global", "US", "UKI", "Canada", "France", "Germany"]
      }
    };

    const data = {
      name: "Consult Operating Model",
      children: [
        {
          name: "Global Practices",
          children: [
            { name: "Cloud" },
            { name: "Enterprise Services (ADAI)" },
            { name: "CoreZ" },
            { name: "DWS" },
            { name: "Network & Edge" },
            { name: "Sec & Res" }
          ]
        },
        {
          name: "Service Lines",
          children: [
            { name: "Enterprise Transformation: EA, PPM, Change, Transformation, IT Strategy, Process, Bridge Insights" },
            { name: "Data and AI" }
          ]
        },
        {
          name: "Channels to Market",
          children: [
            { name: "Consult Partners and Customer Partner/Managing Partners" },
            { name: "Vital" },
            { name: "Alliances, Hyperscalers and Partnering" },
            { name: "Kyndryl Institute" },
            { name: "Value Proposition Management and Marketing (CVP)" }
          ]
        },
        {
          name: "Enabling Capabilities",
          children: [
            { name: "Growth: Investment cases, GTM, Sales Hub, Process, Knowledge mgmt" },
            { name: "Collaboratives" },
            { name: "Industry" },
            { name: "Consulting Workforce Transformation: Professions, Training, Career paths, Skills, Pyramid" },
            { name: "Consult Methods, Tools and Platforms (AI)" }
          ]
        }
      ]
    };

    const calculateNodeWeights = (node) => {
      if (node.children) {
        node.weight = node.children.length + 1;
        node.children = node.children.map(child => calculateNodeWeights(child));
      } else {
        node.weight = 1;
      }
      node.isClickable = !!details[node.name];
      return node;
    };

    const calculatePositions = (node, angle = 0, radius = 0, parentX = 0, parentY = 0, level = 0, seed = 1) => {
      const results = [];
      
      const angleOffset = (Math.sin(seed + level) * 0.5) * 0.5;
      const radiusOffset = (Math.cos(seed + level) * 20);
      
      const adjustedAngle = angle + angleOffset;
      const adjustedRadius = radius + radiusOffset;
      
      const x = parentX + Math.cos(adjustedAngle) * adjustedRadius;
      const y = parentY + Math.sin(adjustedAngle) * adjustedRadius;
      
      results.push({ 
        name: node.name, 
        x,
        y,
        weight: node.weight,
        level,
        isClickable: node.isClickable
      });

      if (node.children) {
        const baseAngleStep = (2 * Math.PI) / (node.children.length + 1);
        const spreadFactor = 1 - (level * 0.1);
        
        node.children.forEach((child, i) => {
          const childAngle = adjustedAngle + (i - (node.children.length - 1) / 2) * baseAngleStep * spreadFactor;
          const childRadius = 150;
          
          const childResults = calculatePositions(
            child,
            childAngle,
            childRadius,
            x,
            y,
            level + 1,
            seed + i
          );

          const dx = childResults[0].x - x;
          const dy = childResults[0].y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const midX = x + dx / 2;
          const midY = y + dy / 2;
          
          const perpX = -dy / distance * 30;
          const perpY = dx / distance * 30;
          
          results.push({
            isLink: true,
            x1: x,
            y1: y,
            x2: childResults[0].x,
            y2: childResults[0].y,
            ctrl1X: midX + perpX,
            ctrl1Y: midY + perpY,
            ctrl2X: midX - perpX,
            ctrl2Y: midY - perpY
          });

          results.push(...childResults);
        });
      }
      
      return results;
    };

    const weightedData = calculateNodeWeights(structuredClone(data));
    const calculatedNodes = calculatePositions(weightedData);

    return {
      nodes: calculatedNodes,
      nodeDetails: details
    };
  }, []);

  const createSplinePath = (x1, y1, x2, y2, ctrl1X, ctrl1Y, ctrl2X, ctrl2Y) => {
    return `M ${x1} ${y1} C ${ctrl1X} ${ctrl1Y}, ${ctrl2X} ${ctrl2Y}, ${x2} ${y2}`;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleDelta = e.deltaY > 0 ? 0.95 : 1.05;
    const newScale = Math.max(0.5, Math.min(3, transform.scale * scaleDelta));
    setTransform(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  const handleBackgroundMouseDown = (e) => {
    if (e.target === backgroundRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  };

  const handleBackgroundMouseMove = (e) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleBackgroundMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeClick = (e, node) => {
    e.stopPropagation();
    if (nodeDetails[node.name]) {
      setSelectedNode(nodeDetails[node.name]);
    }
  };

  return (
    <div className="relative w-full h-screen bg-white font-sans">
      <div className="absolute top-5 w-full text-center text-lg font-semibold text-gray-700">
        Consult Operating Model Horizon 1: Run and transform with clear accountability in each country
      </div>
      
      {selectedNode && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSelectedNode(null)} />
          <DetailView data={selectedNode} onClose={() => setSelectedNode(null)} />
        </>
      )}

      <svg 
        ref={backgroundRef}
        className="w-full h-full"
        onWheel={handleWheel}
        onMouseDown={handleBackgroundMouseDown}
        onMouseMove={handleBackgroundMouseMove}
        onMouseUp={handleBackgroundMouseUp}
        onMouseLeave={handleBackgroundMouseUp}
      >
        <g transform={`translate(${window.innerWidth/2 + transform.x}, ${window.innerHeight/2 + transform.y}) scale(${transform.scale})`}>
          {nodes.filter(node => node.isLink).map((link, i) => (
            <path
              key={`link-${i}`}
              d={createSplinePath(
                link.x1, link.y1,
                link.x2, link.y2,
                link.ctrl1X, link.ctrl1Y,
                link.ctrl2X, link.ctrl2Y
              )}
              className="fill-none stroke-gray-200"
              strokeWidth={0.5}
            />
          ))}
          
          {nodes.filter(node => !node.isLink).map((node, i) => (
            <g 
              key={`node-${i}`} 
              transform={`translate(${node.x},${node.y})`}
              onClick={(e) => node.isClickable && handleNodeClick(e, node)}
              className={node.isClickable ? "cursor-pointer" : "cursor-default"}
            >
              <circle
                r={Math.max(3, node.weight * 2)}
                className={`stroke-white transition-colors ${
                  node.isClickable 
                    ? 'fill-blue-400 hover:fill-blue-600' 
                    : 'fill-gray-400'
                }`}
                strokeWidth={1}
                opacity={0.8}
              />
              <text
                dy="0.31em"
                x={Math.max(3, node.weight * 2) + 5}
                textAnchor="start"
                className={`text-xs ${transform.scale > 1.5 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                style={{ pointerEvents: 'none' }}
              >
                {node.name}
              </text>
              {node.isClickable && (
                <circle
                  r={Math.max(10, node.weight * 3)}
                  className="fill-transparent"
                />
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

export default RadialTree;