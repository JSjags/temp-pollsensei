// import React, { useState } from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   ReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   Node,
//   Edge,
//   Position,
// } from "react-flow-renderer";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import { FaCheckCircle, FaUserCheck } from "react-icons/fa";

// const initialNodes: Node[] = [
//   {
//     id: "1",
//     type: "customNode",
//     data: {
//       label: "Design Survey",
//       options: ["Generate with AI", "Create Manually"],
//       progress: 75,
//     },
//     position: { x: 50, y: 50 },
//     sourcePosition: Position.Right,
//   },
//   {
//     id: "2",
//     type: "customNode",
//     data: { label: "Assign Roles", icon: FaUserCheck },
//     position: { x: 350, y: 50 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "3",
//     type: "customNode",
//     data: {
//       label: "Collect Data",
//       options: ["Buy Respondents", "Share Survey"],
//       progress: 50,
//     },
//     position: { x: 650, y: 50 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "4",
//     type: "customNode",
//     data: { label: "Validate Response", icon: FaCheckCircle },
//     position: { x: 200, y: 200 },
//     targetPosition: Position.Left,
//   },
//   {
//     id: "5",
//     type: "customNode",
//     data: { label: "Generate Report", icon: FaCheckCircle },
//     position: { x: 500, y: 200 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "6",
//     type: "customNode",
//     data: {
//       label: "Analyze Survey",
//       options: ["Qualitative Analysis", "Quantitative Analysis"],
//       progress: 90,
//     },
//     position: { x: 800, y: 200 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "7",
//     type: "customNode",
//     data: { label: "Close Survey", icon: FaCheckCircle },
//     position: { x: 1100, y: 50 },
//     targetPosition: Position.Left,
//   },
// ];

// const initialEdges = [
//   {
//     id: "e1-2",
//     source: "1",
//     target: "2",
//     animated: true,
//     style: { stroke: "#9C27B0" },
//   },
//   {
//     id: "e2-3",
//     source: "2",
//     target: "3",
//     animated: true,
//     style: { stroke: "#9C27B0" },
//   },
//   {
//     id: "e3-4",
//     source: "3",
//     target: "4",
//     animated: true,
//     style: { stroke: "#9C27B0" },
//   },
//   {
//     id: "e4-5",
//     source: "4",
//     target: "5",
//     animated: true,
//     style: { stroke: "#9C27B0" },
//   },
//   {
//     id: "e5-6",
//     source: "5",
//     target: "6",
//     animated: true,
//     style: { stroke: "#9C27B0" },
//   },
//   {
//     id: "e6-7",
//     source: "6",
//     target: "7",
//     animated: true,
//     style: { stroke: "#9C27B0" },
//   },
// ];

// const CustomNode = ({ data, id }: { data: any; id: string }) => {
//   return (
//     <div
//       style={{
//         border: "2px dashed #9C27B0",
//         padding: "10px",
//         borderRadius: "8px",
//         background: "#fff",
//         textAlign: "center",
//         cursor: "pointer",
//       }}
//     >
//       <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
//         {data.label}
//       </div>
//       {data.progress !== undefined ? (
//         <CircularProgressbar
//           value={data.progress}
//           text={`${data.progress}%`}
//           styles={buildStyles({
//             textColor: "#4A148C",
//             pathColor: "#4A148C",
//             trailColor: "#f3f3f3",
//           })}
//         />
//       ) : data.icon ? (
//         <data.icon style={{ color: "#4A148C", fontSize: "1.5em" }} />
//       ) : null}
//       {data.options?.map((option: string, index: number) => (
//         <button
//           key={index}
//           style={{
//             marginTop: 10,
//             padding: 5,
//             width: "100%",
//             backgroundColor: "#f3f3f3",
//             borderRadius: 3,
//             border: "none",
//             cursor: "pointer",
//           }}
//           onClick={() => data.onClick(id, option)}
//         >
//           {option}
//         </button>
//       ))}
//     </div>
//   );
// };

// const WorkflowDiagram = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const handleNodeClick = (nodeId: string, option: string) => {
//     alert(`You clicked: ${option}`);

//     const updatedEdges = edges.map((edge) => {
//       if (parseInt(edge.target) <= parseInt(nodeId)) {
//         return {
//           ...edge,
//           style: { stroke: "#4A148C", strokeWidth: 3 },
//         };
//       }
//       return edge;
//     });

//     setEdges(updatedEdges);
//   };

//   const nodeTypes = {
//     customNode: CustomNode,
//   };

//   return (
//     <div style={{ height: 600 }}>
//       <ReactFlowProvider>
//         <ReactFlow
//           nodes={nodes.map((node) => ({
//             ...node,
//             data: {
//               ...node.data,
//               onClick: handleNodeClick,
//             },
//           }))}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           nodeTypes={nodeTypes}
//           fitView
//         >
//           <Background color="#aaa" gap={16} />
//           <Controls />
//         </ReactFlow>
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default WorkflowDiagram;

// import React from "react";
// import ReactFlow, {
//   Background,
//   Controls,
//   ReactFlowProvider,
//   useNodesState,
//   useEdgesState,
//   Node,
//   Edge,
//   Position,
//   Handle,
// } from "reactflow";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";
// import "reactflow/dist/style.css";
// import { FaCheckCircle, FaUserCheck } from "react-icons/fa";

// const initialNodes: Node[] = [
//   {
//     id: "1",
//     type: "customNode",
//     data: {
//       label: "Design Survey",
//       options: ["Generate with AI", "Create Manually"],
//       progress: 75,
//     },
//     position: { x: 50, y: 50 },
//     sourcePosition: Position.Right,
//   },
//   {
//     id: "2",
//     type: "customNode",
//     data: { label: "Assign Roles", icon: FaUserCheck },
//     position: { x: 750, y: 100 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "3",
//     type: "customNode",
//     data: {
//       label: "Collect Data",
//       options: ["Buy Respondents", "Share Survey"],
//       progress: 50,
//     },
//     position: { x: 1250, y: 250 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Top,
//   },
//   {
//     id: "4",
//     type: "customNode",
//     data: { label: "Validate Response", icon: FaCheckCircle },
//     position: { x: 550, y: 300 },
//     targetPosition: Position.Left,
//   },
//   {
//     id: "5",
//     type: "customNode",
//     data: { label: "Generate Report", icon: FaCheckCircle },
//     position: { x: 70, y: 500 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "6",
//     type: "customNode",
//     data: {
//       label: "Analyze Survey",
//       options: ["Qualitative Analysis", "Quantitative Analysis"],
//       progress: 90,
//     },
//     position: { x: 550, y: 500 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left,
//   },
//   {
//     id: "7",
//     type: "customNode",
//     data: { label: "Close Survey", icon: FaCheckCircle },
//     position: { x: 1300, y: 550 },
//     targetPosition: Position.Left,
//   },
// ];

// const initialEdges: Edge[] = [
//   {
//     id: "e1-2",
//     source: "1",
//     target: "2",
//     style: { stroke: "#9C27B0", strokeWidth: 2 },
//   },
//   {
//     id: "e2-3",
//     source: "2",
//     target: "3",
//     style: { stroke: "#9C27B0", strokeWidth: 2 },
//   },
//   {
//     id: "e3-4",
//     source: "3",
//     target: "4",
//     style: { stroke: "#9C27B0", strokeWidth: 2 },
//   },
//   {
//     id: "e4-5",
//     source: "4",
//     target: "5",
//     style: { stroke: "#9C27B0", strokeWidth: 2 },
//   },
//   {
//     id: "e5-6",
//     source: "5",
//     target: "6",
//     style: { stroke: "#9C27B0", strokeWidth: 2 },
//   },
//   {
//     id: "e6-7",
//     source: "6",
//     target: "7",
//     style: { stroke: "#9C27B0", strokeWidth: 2 },
//   },
// ];

// const CustomNode = ({ data, id }: { data: any; id: string }) => {
//   return (
//     <div
//       style={{
//         border: "2px dashed #9C27B0",
//         padding: "10px",
//         borderRadius: "8px",
//         background: "#fff",
//         textAlign: "center",
//         cursor: "pointer",
//         position: "relative",
//       }}
//     >
//       <Handle
//         type="target"
//         position={Position.Left}
//         style={{ background: "#9C27B0" }}
//       />
//       <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
//         {data.label}
//       </div>
//       {data.progress !== undefined ? (
//         <CircularProgressbar
//           className="size-10"
//           value={data.progress}
//           text={`${data.progress}%`}
//           styles={buildStyles({
//             textColor: "#4A148C",
//             pathColor: "#4A148C",
//             trailColor: "#f3f3f3",
//           })}
//         />
//       ) : data.icon ? (
//         <data.icon style={{ color: "#4A148C", fontSize: "1.5em" }} />
//       ) : null}
//       {data.options?.map((option: string, index: number) => (
//         <button
//           key={index}
//           style={{
//             marginTop: 10,
//             padding: 5,
//             width: "100%",
//             backgroundColor: "#f3f3f3",
//             borderRadius: 3,
//             border: "none",
//             cursor: "pointer",
//           }}
//           onClick={() => data.onClick(id, option)}
//         >
//           {option}
//         </button>
//       ))}
//       <Handle
//         type="source"
//         position={Position.Right}
//         style={{ background: "#9C27B0" }}
//       />
//     </div>
//   );
// };

// const WorkflowDiagram = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const handleNodeClick = (nodeId: string, option: string) => {
//     alert(`You clicked: ${option}`);

//     const updatedEdges = edges.map((edge) => {
//       if (parseInt(edge.target) <= parseInt(nodeId)) {
//         return {
//           ...edge,
//           style: { stroke: "#4A148C", strokeWidth: 3 },
//         };
//       }
//       return edge;
//     });

//     setEdges(updatedEdges);
//   };

//   const nodeTypes = {
//     customNode: CustomNode,
//   };

//   return (
//     <div style={{ height: 600 }}>
//       <ReactFlowProvider>
//         <ReactFlow
//           nodes={nodes.map((node) => ({
//             ...node,
//             data: {
//               ...node.data,
//               onClick: handleNodeClick,
//             },
//           }))}
//           edges={edges}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           nodeTypes={nodeTypes}
//           fitView
//         >
//           <Background color="#aaa" gap={16} />
//           <Controls />
//         </ReactFlow>
//       </ReactFlowProvider>
//     </div>
//   );
// };

// export default WorkflowDiagram;
