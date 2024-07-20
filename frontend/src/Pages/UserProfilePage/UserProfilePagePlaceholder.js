import { Card, Placeholder } from "semantic-ui-react"

const UserProfilePagePlaceholder = () => {
  return (
    <div>
        <Card.Content style={{ margin: "5px" }} >
          <Placeholder>
              <Placeholder.Image style={{ height: "300px" }} />
              <Placeholder.Line />
              <Placeholder.Line />
          </Placeholder>
        </Card.Content>
    </div>
  )
}

export default UserProfilePagePlaceholder