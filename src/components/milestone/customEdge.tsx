import {
  BaseEdge,
  BezierEdge,
  EdgeProps,
  getBezierPath,
  getStraightPath,
} from "@xyflow/react";

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export default function CustomEdge(props: EdgeProps) {
  // const [edgePath] = getBezierPath(props);

  // we are using the default bezier edge when source and target ids are different
  // if (props.source !== props.target) {
  //   return <BezierEdge {...props} />;
  // }

  const { sourceX, sourceY, targetX, targetY } = props;
  const radius = 60; // Adjust the radius as needed for roundness
  const horizontalDirection = targetX > sourceX ? 1 : -1; // Determine the direction

  const edgePath = `M ${sourceX - 5 * horizontalDirection} ${sourceY} H ${
    targetX - radius * horizontalDirection
  } A ${radius} ${radius} 0 0 ${horizontalDirection === 1 ? 1 : 0} ${targetX} ${
    sourceY + radius
  } V ${targetY}`;

  return <BaseEdge path={edgePath} {...props} className="" />;
}
