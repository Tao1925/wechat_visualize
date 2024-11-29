import csv

MSG_INDEX = 7
DATE_INDEX = 8
MONTH_STRING_SIZE = 7
DAY_STRING_SIZE = 10

def count_chat_monthly(reader):
    month_dict = {}

    for row in reader:
        date = row[DATE_INDEX]
        month_date = date[:MONTH_STRING_SIZE]
        if month_date not in month_dict.keys():
            month_dict[month_date] = 1
        else:
            month_dict[month_date] += 1

    f = open("../../output/count_chat_monthly.csv", mode='w', encoding='utf-8')
    for key, value in month_dict.items():
        f.write(key + ' ' + str(value) + '\n')


def count_chat_daily(reader):
    day_dict = {}

    for row in reader:
        date = row[DATE_INDEX]
        day_date = date[:DAY_STRING_SIZE]
        if day_date not in day_dict.keys():
            day_dict[day_date] = 1
        else:
            day_dict[day_date] += 1

    f = open("../../output/count_chat_daily.csv", mode='w', encoding='utf-8')
    for key, value in day_dict.items():
        f.write(key + ' ' + str(value) + '\n')


def read_csv():
    f = open("../../data/chat.csv", mode='r', encoding='utf-8')
    reader = csv.reader(f)

    # count_chat_monthly(reader)
    count_chat_daily(reader)


if __name__ == '__main__':
    read_csv()
