export interface Header {
  code: number
  message: string
  sid: string
  status: number
}

export interface Choices {
  status: number
  seq: number
  text: Text[]
}

export interface Text {
  /** system only for `Max` and `Ultra` */
  role: 'user' | 'assistant' | 'system'
  content: string
  index: number
}

export interface Usage {
  text: {
    question_tokens: number
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface Payload {
  choices: Choices
  usage: Usage
}

export interface SparkResponse {
  header: Header
  payload: Payload

}
