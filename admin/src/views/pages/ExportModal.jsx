import {  DownloadOutlined, LoadingOutlined} from '@ant-design/icons';
import React from 'react'

import {
    Button,
    Col,
    Form,
    Modal,
    Row,
    Spin,
    DatePicker,
} from "antd";
const { RangePicker } = DatePicker;


const ExportModal = ({setOpen,exportData,ajxRequesting,open,handleDateChange}) => {
  return (
    <div>
    <Modal
        title="Export In Excel"
        style={{ top: 20 }}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        maskClosable={false}
        width={500}
        footer={[
          <Button key="cancel" onClick={() => setOpen(false)}>Cancel</Button>,
          <Button key="export" type="primary" onClick={exportData} disabled={ajxRequesting}>
            Export
          </Button>,
        ]}
      >
        <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} >
          <Form layout="vertical">
            <Row gutter={[12, 0]}>
              <Col span={24}>
                <RangePicker onChange={handleDateChange} allowClear />
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default ExportModal