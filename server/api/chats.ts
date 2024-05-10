import { sub } from 'date-fns'

const chats = [{
  id: 1,
  title: 'Squat People'
},
{
  id: 2,
  unread: true,
  title: 'Twitchers United'
}, {
  id: 3,
  unread: true,
  title: 'Banjos Buds'
}, {
  id: 4,
  title: 'The Jolly Rogers'
}, {
  id: 5,
  title: 'The A-Team'
}, {
  id: 6,
  title: 'The Incredibles'
},
{
  id: 7,
  title: 'The Avengers'
},
{
  id: 8,
  title: 'The Fantastic Four'
}
]

export default eventHandler(async () => {
  return chats
})
