import csv


def read_csv():

    f = open("../../data/chat.csv", mode='r', encoding='utf-8')
    reader = csv.reader(f)

    for row in reader:
        print(row)



if __name__ == '__main__':
    read_csv()