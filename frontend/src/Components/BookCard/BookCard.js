import { Button, Card, Grid, Icon, Image } from 'semantic-ui-react'
import './BookCard.css'
import BookCardHook from '../../Hooks/BookCardHook'
import UpdateBookModal from '../UpdateBookModal/UpdateBookModal'
import defaultStaticImage from '../../Assets/white-image.png'

const BookCard = ({ book: { id, author, title, cover, user} }) => {
  const [] = BookCardHook()
  return (

        <Card centered fluid style={{ height: '100%' }} >
          <Card.Content extra>
            <UpdateBookModal bookId={id} />
          </Card.Content>
          <Image src={ cover || defaultStaticImage } alt={title} label={{ as: 'a', corner: 'left', icon: 'heart' }} />
          <Card.Content>
            <Card.Header title={title} className='ellipsis-text' >{title}</Card.Header>
            <Card.Meta className='ellipsis-text' style={{ marginTop: '5px' }}>
              <Icon name='user' style={{ marginRight: '5px' }} /> 
                {author}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Button fluid onClick={() => console.log('delete book')}>Delete</Button>
          </Card.Content>
        </Card>

  )
}

export default BookCard