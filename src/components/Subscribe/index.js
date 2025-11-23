import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import { MailOutlined, UserOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { subscribeApi } from '../../utils/blogApi';
import styles from './styles.module.css';

export default function Subscribe() {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError(null);

    try {
      await subscribeApi.create({ 
        email: values.email, 
        nickname: values.nickname 
      });
      setSuccess(true);
      form.resetFields();
      
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || '订阅失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.subscribeBox}>
        <div className={styles.successMessage}>
          <CheckCircleOutlined className={styles.successIcon} style={{ fontSize: '48px', color: '#52c41a' }} />
          <h3>订阅成功！</h3>
          <p>请查收激活邮件以完成订阅</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.subscribeBox}>
      <h3 className={styles.title}>📧 订阅更新</h3>
      <p className={styles.description}>
        订阅以获取最新文章和技术分享
      </p>
      
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className={styles.form}
      >
        <Form.Item
          name="nickname"
          rules={[{ max: 50, message: '昵称不能超过50个字符' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="昵称（可选）"
            disabled={submitting}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: '请输入邮箱地址' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="your@email.com"
            disabled={submitting}
            size="large"
          />
        </Form.Item>
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit"
            loading={submitting}
            block
            size="large"
          >
            {submitting ? '订阅中...' : '订阅'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
