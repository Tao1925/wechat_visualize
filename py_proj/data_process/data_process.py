import csv
# import jieba
from collections import Counter

TYPE_INDEX = 2
MSG_INDEX = 7
DATE_INDEX = 8
NAME_INDEX = 10
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

    f = open("../../output/count_chat_monthly.txt", mode='w', encoding='utf-8')
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

    f = open("../../output/count_chat_daily.txt", mode='w', encoding='utf-8')
    for key, value in day_dict.items():
        f.write(key + ' ' + str(value) + '\n')


def count_chat_hourly(reader):
    hour_dicts = [{}, {}]

    for row in reader:
        date = row[DATE_INDEX]
        name = row[NAME_INDEX]
        colon_index = date.find(':')
        hour = date[DAY_STRING_SIZE + 1: colon_index]
        hour_dict_index = 0
        if name[0] == 'T': hour_dict_index += 1
        hdi = hour_dict_index
        if hour not in hour_dicts[hdi].keys():
            hour_dicts[hdi][hour] = 1
        else:
            hour_dicts[hdi][hour] += 1

    f = open("../../output/count_chat_hourly.txt", mode='w', encoding='utf-8')
    for i in range(len(hour_dicts)):
        for key, value in hour_dicts[i].items():
            f.write(["SXY", "TSY"][i] + ' ' + key + ' ' + str(value) + '\n')

def count_word_frequency(reader):
    text_list = []
    for row in reader:
        msg_type = row[TYPE_INDEX]
        if msg_type != '1':
            continue
        text = row[MSG_INDEX]
        text_list.append(text)
    text_string = " ".join(text_list)
    words = jieba.cut(text_string)

    word_list = list(words)

    # 统计词频
    word_counts = Counter(word_list)
    sorted_word_counts = dict(sorted(word_counts.items(), key=lambda item: item[1],reverse=True))
    # 输出词频
    f = open("../../output/count_word_frequency.txt", mode='w', encoding='utf-8')

    for word, count in sorted_word_counts.items():
        if len(word) <= 1: continue
        if len(word) != 3 and word[0] == word[1]: continue
        f.write(f"{word} {count}\n")


def read_csv():
    f = open("../../data/chat.csv", mode='r', encoding='utf-8')
    reader = csv.reader(f)

    # count_chat_monthly(reader)
    # count_chat_daily(reader)
    count_chat_hourly(reader)
    # count_word_frequency(reader)


if __name__ == '__main__':
    read_csv()
