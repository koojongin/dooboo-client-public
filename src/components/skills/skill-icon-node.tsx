import { memo, useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import { Handle, Position } from 'reactflow'
import {
  SkillIconData,
  SkillIconNode,
} from '@/components/skills/skill.interface'

function SkillIconNodeComponent(node: SkillIconNode | any) {
  const { data } = node
  const [nodeData, setNodeData] = useState<SkillIconData>({ ...data })
  // eslint-disable-next-line prefer-const
  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable
      />
      <Tooltip content="하하하~">
        <div
          className={`w-[30px] h-[30px] ${nodeData.isLearned ? '' : 'opacity-20'}`}
          onClick={() => {
            const newNodeData = { ...nodeData }
            newNodeData.isLearned = !newNodeData.isLearned
            setNodeData(newNodeData)
          }}
        >
          <img className="w-full h-full" src={nodeData.src} />
        </div>
      </Tooltip>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: '#555' }}
        isConnectable
      />
    </div>
  )
}

export default memo(SkillIconNodeComponent)
