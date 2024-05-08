import { useState } from 'react'
import { Tooltip } from '@material-tailwind/react'
import { Handle, Position } from 'reactflow'
import { SkillIconNode } from '@/components/skills/skill.interface'

export default function SkillIconNodeComponent(node: SkillIconNode | any) {
  const { data, selected } = node
  const [, forceRefresh] = useState<number>(0)
  return (
    <div>
      <Handle
        type="source"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable
      />
      <Tooltip content="하하하~">
        <div className={`w-[30px] h-[30px] ${selected ? '' : 'opacity-20'}`}>
          <img className="w-full h-full" src={data.src} />
        </div>
      </Tooltip>
      <Handle
        type="target"
        position={Position.Right}
        id="a"
        style={{ background: '#555' }}
        isConnectable
      />
    </div>
  )
}
