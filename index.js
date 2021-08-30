// Превью чата
class ChatBarItem extends React.Component{
  constructor(props){
    super(props)
    this.toggleChat = this.toggleChat.bind(this)
  }

  toggleChat(){
    this.props.setCurrentChat(this.props.id)
  }

  render(){
    return(
      <div className='chatBarItem' onClick={() => this.toggleChat()}>
        <p className='chatBarItemName'>{this.props.name.length < 15 ? this.props.name : this.props.name.slice(0, 15) + "..."}</p>
        <p className='chatBarItemText'>{this.props.lastMessage.length < 15 ? this.props.lastMessage : this.props.lastMessage.slice(0, 15) + "..."}</p>
        <button onClick={() => this.props.deleteChat(this.props.id)}>x</button>
      </div>
    )
  }
}
// Сообщение в блоке чата
class Message extends React.Component{
  constructor(props){
    super(props)
    this.state = {

    }
  }
  render(){
    return(
      <div className='messageBlock'>
        <p>{this.props.author}</p>
        <p>{this.props.text}</p>
        <button onClick={() => this.props.deleteMessage(this.props.currentChat, this.props.id)}>x</button>
      </div>
    )
  }
}
// Панель выбора чата
class ChatBar extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div className='chatBar'>
        <p className='chatName'>Чаты</p>
        {this.props.chats.map(function(chat, idx){
         return(<ChatBarItem deleteChat={(chatId) => this.props.deleteChat(chatId)} newMessage={this.props.newMessageDate} setCurrentChat={this.props.setCurrentChat} key={idx} id={chat.chatId} name={chat.chatName} lastMessage={chat.chatMessages[0] ? chat.chatMessages[chat.chatMessages.length - 1].text : 'Сообщений нет'}/>)
        }, this)}
        <button onClick={this.props.addChat()}>+</button>
      </div>
    )
  }
}
// Окно чата
class ChatWindow extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      value: '',
      userName: ''
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.enterSubmit = this.enterSubmit.bind(this)
  }

  componentDidMount(){
    let newUserName = prompt('Введите имя пользователя')
    this.setState({userName: newUserName})
  }

  componentDidUpdate() {
    document.getElementById('chatBlock').scrollTop = document.getElementById('chatBlock').scrollHeight
  }

  sendMessage(e){
    e.preventDefault()
    if(this.state.value.trim()){
      this.props.sendMessage(this.state.userName, this.state.value)
      this.setState({value: ''})
      document.getElementById("sendMessageForm").reset()
    }
  }

  enterSubmit(event) {
    if(event.key == 'Enter'){
      if(this.state.value.trim()){
        this.props.sendMessage(this.state.userName, this.state.value)
        this.setState({value: ''})
        document.getElementById("sendMessageForm").reset()
      }
    }
  }

  render(){
    return(
        <div className='chatWindow'>
          <div id='chatBlock' className='chatMessages'>
            <p className='chatName'>{this.props.Chat ? this.props.Chat.chatName : ' '}</p>
            {this.props.Chat ? this.props.Chat.chatMessages.map(function(message, idx){
            return(<Message currentChat={this.props.currentChat} deleteMessage={(chatId, MessageId) => this.props.deleteMessage(chatId, MessageId)} key={idx} id={message.id} author={message.authorName} text={message.text} />)}, this) : ' '}
          </div>
          <form id='sendMessageForm' onSubmit={this.sendMessage} className='sendMessageForm'>
            <textarea onKeyUp={(event) => this.enterSubmit(event)} onChange={event => this.setState({value: event.target.value})}/>
            <input type='submit' value='' />
          </form>
        </div>
    )
  }
}
// Приложение
function App(){
    const [chats, setChats] = React.useState([ ])
    const [currentChat, setCurrentChat] = React.useState(1)
    const [newMessageDate, setNewMessageDate] = React.useState(Date.now())
      function sendMessage(AuthorName, MessageText){
        let instanceChats = chats
        instanceChats[chats.findIndex(chat => chat.chatId == currentChat)].chatMessages.push({
          id: Date.now(),
          authorName: AuthorName,
          text: MessageText,
          date: Date.now()
        })
        setChats(instanceChats)
        setNewMessageDate(Date.now())
      }

      function addChat(){
        let instanceChats = chats
        let enterName = prompt('Введите имя чата', 'Новый чат')
        instanceChats.push(
          {chatId: Date.now(),
           chatName: enterName,
           chatMessages: []
          }
        )
        setChats(instanceChats)
        setNewMessageDate(Date.now())
      }

      function deleteChat(chatId) {
        let deletableСhatId = chats.findIndex(chat => chat.chatId == chatId)
        let instanceChats = chats
        chats.splice(deletableСhatId, 1)
        setChats(instanceChats)
        setNewMessageDate(Date.now())
      }

      function deleteMessage(chatId, MessageId) {
        let deletableСhatId = chats.findIndex(chat => chat.chatId == chatId)
        let deletableMessageId = chats[deletableСhatId].chatMessages.findIndex(chat => chat.id == MessageId)
        let instanceChats = chats
        instanceChats[deletableСhatId].chatMessages.splice(deletableMessageId, 1)
        setChats(instanceChats)
        setNewMessageDate(Date.now())
      }
      

    return (
      <React.Fragment>
        <h1>Re:comm;</h1>
        <div className='chatBlock'>
          <ChatBar deleteChat={(chatId) => deleteChat(chatId)} addChat={() => addChat} newMessage={newMessageDate} setCurrentChat={function(ChatId){setCurrentChat(ChatId)}} chats={chats} />
          <ChatWindow deleteMessage={(chatId, MessageId) => deleteMessage(chatId, MessageId)} sendMessage={(AuthorName, MessageText) => sendMessage(AuthorName, MessageText)} Chat={chats.find(chat => chat.chatId == currentChat)} currentChat={currentChat} />
        </div>
      </React.Fragment>
    )
}
// Рендер приложения
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
