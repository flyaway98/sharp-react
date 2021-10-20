export interface Schema {
    name: string,
    subfolder?: boolean,
    styleSheet: 'less' | 'scss',
    cssModule?: boolean
    ts?: boolean,
    useRedux?: boolean,
    useRouter?: boolean,
    antd?: boolean
  }
  