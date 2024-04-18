import csv
import numpy as np
from PIL import Image

def load_mnist_csv(file_path):
    images = []
    labels = []
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        next(reader)
        for row in reader:
            labels.append(int(row[0]))
            image_data = np.array([int(pixel) for pixel in row[1:]], dtype=np.uint8)
            images.append(image_data)
    return np.array(images), np.array(labels)
def resize_images(images, new_size):
    resized_images = []
    for img_array in images:
        img = Image.fromarray(img_array.reshape(28, 28))
        img = img.resize(new_size)
        resized_images.append(np.array(img).flatten())
    return np.array(resized_images)

mnist_file_path = 'mnist_train.csv'

mnist_images, mnist_labels = load_mnist_csv(mnist_file_path)

new_size = (50, 50)
resized_images = resize_images(mnist_images, new_size)

with open('mnist_train_50x50.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    for i in range(len(resized_images)):
        row = [mnist_labels[i]] + list(resized_images[i])
        writer.writerow(row)
