import numpy as np
from scipy.io.wavfile import write
import os

# Создаем директорию, если не существует
if not os.path.exists('sounds'):
    os.makedirs('sounds')

# Частота дискретизации
sample_rate = 44100

# Длительность в секундах
duration_move = 0.1
duration_merge = 0.15
duration_error = 0.2
duration_win = 0.5
duration_game_over = 0.8

def generate_sine_wave(freq, duration, volume=0.5, fade=0.02):
    """Генерация синусоидальной волны"""
    t = np.linspace(0, duration, int(duration * sample_rate), False)
    wave = np.sin(2 * np.pi * freq * t) * volume
    
    # Добавление затухания в начале и конце для избежания щелчков
    fade_samples = int(fade * sample_rate)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    
    if len(wave) > 2 * fade_samples:
        wave[:fade_samples] *= fade_in
        wave[-fade_samples:] *= fade_out
    
    return wave

def generate_square_wave(freq, duration, volume=0.3, fade=0.02):
    """Генерация квадратной волны"""
    t = np.linspace(0, duration, int(duration * sample_rate), False)
    wave = np.sign(np.sin(2 * np.pi * freq * t)) * volume
    
    # Добавление затухания
    fade_samples = int(fade * sample_rate)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    
    if len(wave) > 2 * fade_samples:
        wave[:fade_samples] *= fade_in
        wave[-fade_samples:] *= fade_out
    
    return wave

def generate_noise_burst(duration, volume=0.3, fade=0.02):
    """Генерация шумового всплеска"""
    samples = int(duration * sample_rate)
    wave = np.random.uniform(-1, 1, samples) * volume
    
    # Добавление затухания
    fade_samples = int(fade * sample_rate)
    fade_in = np.linspace(0, 1, fade_samples)
    fade_out = np.linspace(1, 0, fade_samples)
    
    if len(wave) > 2 * fade_samples:
        wave[:fade_samples] *= fade_in
        wave[-fade_samples:] *= fade_out
    
    return wave

def add_reverb(wave, delay=0.05, decay=0.5):
    """Добавление эффекта реверберации"""
    delay_samples = int(delay * sample_rate)
    reverb = np.zeros_like(wave)
    reverb[delay_samples:] += wave[:-delay_samples] * decay
    return wave + reverb

def save_wave_to_file(wave, filename):
    """Сохранение волны в WAV файл"""
    # Нормализация для предотвращения искажений
    wave = np.int16(wave * 32767)
    write(filename, sample_rate, wave)
    print(f"Создан файл: {filename}")

# Генерация звука перемещения
move_sound = generate_sine_wave(freq=440, duration=duration_move)
save_wave_to_file(move_sound, 'sounds/move.wav')

# Генерация звука ошибки
error_wave1 = generate_sine_wave(freq=220, duration=duration_error/2)
error_wave2 = generate_sine_wave(freq=200, duration=duration_error/2)
error_sound = np.concatenate([error_wave1, error_wave2])
save_wave_to_file(error_sound, 'sounds/error.wav')

# Генерация звука победы
win_sound = generate_sine_wave(freq=880, duration=duration_win/4)
for i in range(3):
    next_freq = 880 * (1.25 ** (i+1))
    next_wave = generate_sine_wave(freq=next_freq, duration=duration_win/4)
    win_sound = np.concatenate([win_sound, next_wave])
win_sound = add_reverb(win_sound)
save_wave_to_file(win_sound, 'sounds/win.wav')

# Генерация звука окончания игры
game_over_sound = generate_sine_wave(freq=440, duration=duration_game_over/4)
for i in range(3):
    next_freq = 440 * (0.8 ** (i+1))
    next_wave = generate_sine_wave(freq=next_freq, duration=duration_game_over/4)
    game_over_sound = np.concatenate([game_over_sound, next_wave])
game_over_sound = add_reverb(game_over_sound)
save_wave_to_file(game_over_sound, 'sounds/game-over.wav')

# Генерация звуков слияния для разных значений плиток
tile_values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]
base_freq = 220

for value in tile_values:
    # Чем выше значение плитки, тем выше частота
    freq_multiplier = np.log2(value) / 3  # Логарифмическое увеличение частоты
    freq = base_freq * (1 + freq_multiplier)
    
    # Генерация звука слияния
    merge_sound = generate_sine_wave(freq=freq, duration=duration_merge)
    add_freq = freq * 1.5
    additional_wave = generate_sine_wave(freq=add_freq, duration=duration_merge, volume=0.3)
    
    # Добавление второго слоя для более "богатого" звука
    # Убедимся, что размеры совпадают
    additional_wave = additional_wave[:len(merge_sound)]
    merge_sound += additional_wave
    
    # Нормализация для предотвращения искажений
    merge_sound = merge_sound / np.max(np.abs(merge_sound)) * 0.8
    
    save_wave_to_file(merge_sound, f'sounds/merge-{value}.wav')

print("Все звуки успешно сгенерированы.")