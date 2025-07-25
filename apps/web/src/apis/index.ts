const baseURL = "http://localhost:3000/api/"

async function resumeConversation(id: string) {
  const resp = await fetch(new URL(baseURL + `conversations/${id}`))
  return resp.json()
}

export default {
  conversations: {
    resume: resumeConversation
  }
}