
import sys
import re

def check_braces(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    scripts = re.findall(r'<script>(.*?)</script>', content, re.DOTALL)
    
    for i, script in enumerate(scripts):
        print(f"Checking script block {i}...")
        stack = []
        lines = script.split('\n')
        
        in_string = None
        in_comment = None
        in_regex = False
        
        for line_no, line in enumerate(lines, 1):
            char_no = 0
            while char_no < len(line):
                char = line[char_no]
                char_no += 1
                
                if in_comment == 'single':
                    break # Skip rest of line
                if in_comment == 'multi':
                    if char == '*' and char_no < len(line) and line[char_no] == '/':
                        in_comment = None
                        char_no += 1
                    continue
                
                if in_string:
                    if char == '\\':
                        char_no += 1 # Skip escaped char
                    elif char == in_string:
                        in_string = None
                    continue
                
                # Start of string or comment
                if char == '"' or char == "'" or char == '`':
                    in_string = char
                elif char == '/' and char_no < len(line):
                    if line[char_no] == '/':
                        in_comment = 'single'
                        char_no += 1
                    elif line[char_no] == '*':
                        in_comment = 'multi'
                        char_no += 1
                elif char == '{':
                    stack.append(('{', line_no, char_no))
                elif char == '}':
                    if not stack:
                        print(f"Unmatched '}}' at line {line_no}, char {char_no}")
                        continue
                    opening, o_line, o_char = stack.pop()
                    if opening != '{':
                        print(f"Mismatched '}}' at line {line_no}, char {char_no} (expected {opening}, got {opening})") # Simplified error
                elif char == '(':
                    stack.append(('(', line_no, char_no))
                elif char == ')':
                    if not stack:
                        print(f"Unmatched ')' at line {line_no}, char {char_no}")
                        continue
                    opening, o_line, o_char = stack.pop()
                    if opening != '(':
                        print(f"Mismatched ')' at line {line_no}, char {char_no}")
                elif char == '[':
                    stack.append(('[', line_no, char_no))
                elif char == ']':
                    if not stack:
                        print(f"Unmatched ']' at line {line_no}, char {char_no}")
                        continue
                    opening, o_line, o_char = stack.pop()
                    if opening != '[':
                        print(f"Mismatched ']' at line {line_no}, char {char_no}")
            
            if in_comment == 'single':
                in_comment = None
        
        while stack:
            opening, o_line, o_char = stack.pop()
            print(f"Unclosed '{opening}' from line {o_line}, char {o_char}")

if __name__ == "__main__":
    check_braces(sys.argv[1])
