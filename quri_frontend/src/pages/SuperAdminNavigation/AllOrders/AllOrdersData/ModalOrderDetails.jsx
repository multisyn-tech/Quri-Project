import React from 'react';
import { Descriptions, Card, List, Badge } from 'antd';

const ModalOrderDetails = ({ orderDetails }) => {
  return (
    <div className="px-4 py-6">
      {orderDetails && orderDetails.length > 0 ? (
        <List
          grid={{ gutter: 16, column:1 }} //You can make column 2 to make it side by side.
          dataSource={orderDetails}
          renderItem={(detail) => (
            <List.Item>
              <Card
                title={`Menu ID: ${detail.MenuID}`}
                bordered={false}
                className="rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl bg-white dark:bg-gray-800"
                headStyle={{ fontSize: '1.25rem', color: '#1f2937' }} // Dark mode-aware title style
              >
                <Descriptions 
                  bordered 
                  column={1} 
                  className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  labelStyle={{ fontWeight: '500', color: '#4b5563' }} // Modern text color for labels
                  contentStyle={{ fontWeight: '600', color: '#1f2937' }} // Enhanced content style
                >
                  <Descriptions.Item label="Item Name">
                    <span className="text-lg">{detail.ItemName}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Category Name">
                    <span className="text-lg">{detail.CategoryName}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Quantity">
                    <span className="text-lg">{detail.Quantity}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Price">
                    <span className="text-lg">AED {detail.Price}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Status">
                    <Badge
                      status={detail.Status === 'Received' ? 'processing' : 'default'}
                      text={
                        <span className={`font-semibold ${detail.Status === 'Received' ? 'text-green-600' : 'text-gray-500'}`}>
                          {detail.Status}
                        </span>
                      }
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Is Served">
                    {detail.isServed === 'No' ? (
                      <Badge status="error" text={<span className="font-semibold text-red-500">Not Served</span>} />
                    ) : (
                      <Badge status="success" text={<span className="font-semibold text-green-500">Served</span>} />
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-300">No order details available.</p>
      )}
    </div>
  );
};

export default ModalOrderDetails;
