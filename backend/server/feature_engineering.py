import numpy as np
import emoji
from collections import Counter
from math import log2


def uppercase_count(s):
    return sum(1 for c in s if c.isupper())


def lowercase_count(s):
    return sum(1 for c in s if c.islower())


def numeric_count(s):
    return sum(1 for c in s if c.isdigit())


def special_count(s):
    return sum(1 for c in s if not c.isalnum())


def emoji_count(s):
    return sum(1 for c in s if c in emoji.EMOJI_DATA)


def hashtag_count(s):
    return sum(1 for c in s if c == "#")


def ratio(a, b):
    if a == 0:
        return 0
    if b == 0:
        return None

    return a / b


def word_count(s):
    return len(s.split())


def string_entropy(s):
    # Strip leading and trailing whitespace
    s = s.strip()

    # Calculate frequency of each character
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1

    # Calculate probability of each character
    probabilities = [count / len(s) for count in freq.values()]

    # Calculate entropy
    entropy = -sum(p * np.log2(p) for p in probabilities if p > 0)
    # remove np.float64 type
    entropy = float(entropy)
    return entropy
