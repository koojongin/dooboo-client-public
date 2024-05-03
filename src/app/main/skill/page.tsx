'use client'

import { Card } from '@material-tailwind/react'
import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import SkillIconNodeComponent from '@/components/skills/skill-icon-node'
import { SkillIconNode } from '@/components/skills/skill.interface'

export default function SkillPage() {
  const nodeTypes = {
    // custom: SkillIconNode,
    skill: SkillIconNodeComponent,
  }
  const initNodes: SkillIconNode[] = [
    {
      id: '1',
      type: 'skill',
      data: { src: '/images/skills/swordman/strike.webp', isLearned: true },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      type: 'skill',
      data: { src: '/images/skills/swordman/strike.webp' },

      position: { x: 35, y: 0 },
    },
    {
      id: '3',
      type: 'skill',
      data: { src: '/images/skills/swordman/strike.webp' },
      position: { x: 70, y: 0 },
    },
  ]

  const initEdges = [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
    },
    { id: 'e1-3', source: '1', target: '3' },
  ]
  const [nodes, setNodes] = useState<any>(initNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges)
  const onConnect = useCallback((params: any) => {
    console.log(params)
    setEdges((els) => addEdge(params, els))
  }, [])

  const test = () => {
    const newNodes = [...initNodes]
    newNodes[0].position.y = 50
    setNodes(newNodes)
  }

  useEffect(() => {
    setNodes(initNodes)
    setEdges(initEdges)
  }, [])

  return (
    <div className="w-full">
      <Card className="rounded w-full">
        <div className="flex items-center">
          <div
            className="cursor-pointer bg-green-400 text-white p-[20px]"
            onClick={() => test()}
          >
            테스트
          </div>
        </div>
        <ReactFlowProvider>
          <div style={{ height: 500 }}>
            <ReactFlow
              nodeTypes={nodeTypes}
              edges={edges}
              nodes={nodes}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <Background color="#aaa" gap={10} />
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </Card>
    </div>
  )
}
