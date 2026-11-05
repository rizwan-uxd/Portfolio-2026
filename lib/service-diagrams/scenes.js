export const examples = {
  growth: {
    title: 'From idea to build',
    blockFinish:'panel', cameraMotion:'fixed',
    description: 'A single signal climbs four graphite stages from the first spark to the finished build.',
    nodes: [
      {id:'idea', label:'Idea', icon:'idea', x:2.85, height:.53},
      {id:'explore', label:'Explore', icon:'explore', x:.95, height:1.12},
      {id:'validate', label:'Validate', icon:'validate', x:-.95, height:1.78},
      {id:'build', label:'Build', icon:'build', x:-2.85, height:2.45}
    ],
    edges: [
      {id:'discover', from:'idea', to:'explore'},
      {id:'test', from:'explore', to:'validate'},
      {id:'ship', from:'validate', to:'build'}
    ]
  },
  research: {
    title: 'Evidence to decisions',
    blockFinish:'panel', cameraMotion:'fixed',
    description: 'Interviews, testing and analytics converge into findings, which are validated before design begins.',
    nodes: [
      {id:'people',label:'Interviews',icon:'people',x:-5.78,z:-1.09,height:.65,labelSide:'above'},
      {id:'tests',label:'Usability',icon:'explore',x:-1.42,z:-3.09,height:.65,labelSide:'above'},
      {id:'metrics',label:'Analytics',icon:'chart',x:2.95,z:-5.09,height:.65,labelSide:'above'},
      {id:'findings',label:'Findings',icon:'document',x:0.42,z:0.91,height:1.1},
      {id:'validate',label:'Validate',icon:'validate',x:-1.63,z:6.03,height:.78},
      {id:'design',label:'Design',icon:'edit',x:5.64,z:2.7,height:.78}
    ],
    edges: [
      {id:'interview-findings',from:'people',to:'findings'},
      {id:'test-findings',from:'tests',to:'findings'},
      {id:'metrics-findings',from:'metrics',to:'findings'},
      {id:'validate',from:'findings',to:'validate'},
      {id:'design',from:'validate',to:'design',via:[[2.5,5.45]]}
    ],
    start:['people','tests','metrics'],
    beats:[
      {edges:['interview-findings','test-findings','metrics-findings']},
      {edges:['validate']},
      {active:['validate'],seconds:.3},
      {edges:['design']}
    ]
  },
  interaction: {
    title: 'Complex Interaction Design',
    description: 'Data moves through two reviewers to an approved status. Each panel rises as it becomes active.',
    projection:'isometric',
    board:{x:3.125,z:2.5,width:6.25,depth:5},
    nodes: [
      {id:'data',label:'Data',form:'data-sheet',x:1.156,z:2.438},
      {id:'review',label:'Review',form:'review-sheet',x:3.125,z:2.438},
      {id:'status',label:'Status',form:'status-sheet',x:5.094,z:2.438}
    ],
    edges: [
      {id:'submit',from:'data',to:'review',lift:.015},
      {id:'update',from:'review',to:'status',lift:.015}
    ],
    beats:[
      {edges:['submit']},
      {edges:['update']}
    ]
  },
  conversational: {
    title: 'AI-Native & Conversational Experience',
    description: 'The AI conversation requests confirmation. The human approves at Confirm, then the action runs.',
    projection:'isometric',
    board:{x:1.875,z:3.75,width:3.75,depth:7.5},
    nodes: [
      {id:'conversation',label:'Conversation',form:'conversation',x:1.875,z:1.687},
      {id:'confirm',label:'Confirm',form:'confirm-key',x:1.875,z:4.031},
      {id:'person',label:'Human',form:'person',x:5.02,z:3.95},
      {id:'action',label:'Action',form:'action-tile',x:1.875,z:6.25}
    ],
    edges: [
      {id:'request-confirmation',from:'conversation',to:'confirm',lift:.015},
      {id:'human-approval',from:'person',to:'confirm',lift:.035},
      {id:'execute',from:'confirm',to:'action',lift:.015}
    ],
    beats:[
      {edges:['request-confirmation']},
      {active:['confirm'],seconds:.4},
      {active:['person'],seconds:.35},
      {edges:['human-approval'],seconds:.95},
      {active:['confirm'],seconds:.3},
      {edges:['execute']}
    ]
  },
  prototyping: {
    title:'Interactive Code Prototyping',
    description:'Five tools feed the prompt. The prompt writes, the token travels, and the laptop opens to reveal the working prototype.',
    projection:'isometric', figure:'prototype', intro:0, outro:.975,
    nodes:[
      {id:'claude',label:'Claude'},{id:'cursor',label:'Cursor'},{id:'v0',label:'v0'},
      {id:'lovable',label:'Lovable'},{id:'figma',label:'Figma'},
      {id:'prompt',label:'Prompt'},{id:'build',label:'Build'}
    ],
    edges:[
      {id:'claude-prompt',from:'claude',to:'prompt'},{id:'cursor-prompt',from:'cursor',to:'prompt'},
      {id:'v0-prompt',from:'v0',to:'prompt'},{id:'lovable-prompt',from:'lovable',to:'prompt'},
      {id:'figma-prompt',from:'figma',to:'prompt'},{id:'prompt-build',from:'prompt',to:'build'}
    ],
    start:['claude','cursor','v0','lovable','figma'],
    beats:[{active:['prompt'],seconds:1.2},{active:['build'],seconds:2.21},{active:['build'],seconds:2.115}]
  },
  tokenOps: {
    title:'Scalable Design Systems & Token Ops',
    description:'Tokens, components, and pages fold into a single system that an agent and a human can read.',
    projection:'isometric', figure:'token-stack', intro:0, outro:1.7,
    nodes:[
      {id:'tokens',label:'Tokens'},{id:'components',label:'Components'},{id:'pages',label:'Pages'},
      {id:'system',label:'Machine-readable design system'},{id:'agent',label:'Agent'},{id:'human',label:'Human'}
    ],
    edges:[{id:'agent-reads',from:'agent',to:'system'},{id:'human-reads',from:'human',to:'system'}],
    start:['tokens','components','pages'],
    beats:[{active:['tokens','components','pages'],seconds:1.1},{active:['system'],seconds:.3},{active:['agent','human'],seconds:.5}]
  },
  systems: {
    title: 'Request to response',
    description: 'A gateway fans out to a service and cache before the response returns.',
    theme:{accent:'#e0bd82'},
    nodes: [
      {id:'request',label:'Request',icon:'cloud',x:-3.75,height:.7},
      {id:'gateway',label:'Gateway',icon:'bolt',x:-1.25,height:1.18},
      {id:'service',label:'Service',icon:'layers',x:1.25,z:-1.55,height:1.4,labelSide:'above'},
      {id:'cache',label:'Cache',icon:'storage',x:1.25,z:1.55,height:.7},
      {id:'response',label:'Response',icon:'validate',x:3.75,height:1.1}
    ],
    edges: [
      {id:'enter',from:'request',to:'gateway'},
      {id:'service',from:'gateway',to:'service'},
      {id:'cache',from:'gateway',to:'cache'},
      {id:'return-service',from:'service',to:'response'},
      {id:'return-cache',from:'cache',to:'response'}
    ],
    beats:[
      {edges:['enter']},{edges:['service','cache']},{edges:['return-service','return-cache']}
    ]
  }
};
