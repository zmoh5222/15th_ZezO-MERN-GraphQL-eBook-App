import { Button, Form, Icon, Message, Modal } from 'semantic-ui-react'
import './AddCategoryModal.css'
import AddCategoryModalHook from '../../Hooks/AddCategoryModalHook'

const AddCategoryModal = () => {
  const [modalOpen, modalCloseHandler, modalOpenHandler, categoryInputValue, categoryInputOnChangeHandler, addCategorySubmitHandler, addCategoryLoading, addCategoryError] = AddCategoryModalHook()
  return (
    <div>
      <Modal
        trigger={<Button labelPosition='right' icon='folder outline' content='Add Category' primary size='small' />}
        size='tiny'
        closeOnDimmerClick={!addCategoryLoading}
        onClose={modalCloseHandler}
        onOpen={modalOpenHandler}
        open={modalOpen}
        >
        <Modal.Header>Add Category</Modal.Header>
        <Modal.Content>
          <Form error={!!addCategoryError}>
            <Form.Input
              label='Category Name'
              icon='folder outline'
              iconPosition='left'
              placeholder='Category Name'
              name='categoryName'
              value={categoryInputValue}
              onChange={categoryInputOnChangeHandler}
              error={!!addCategoryError}
            />
            <Message
              error
              header='Add Category Failed'
              content={addCategoryError?.message}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button type='submit' primary onClick={addCategorySubmitHandler} loading={addCategoryLoading} disabled={addCategoryLoading}>Add</Button>
          <Button type='button' onClick={modalCloseHandler} disabled={addCategoryLoading}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default AddCategoryModal