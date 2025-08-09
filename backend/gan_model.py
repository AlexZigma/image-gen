import torch
import torch.nn as nn
from PIL import Image

class SimpleGenerator(nn.Module):
    def __init__(self, z_dim=100, img_dim=28*28):
        super().__init__()
        self.gen = nn.Sequential(
            nn.Linear(z_dim, 256),
            nn.ReLU(),
            nn.Linear(256, img_dim),
            nn.Tanh()
        )

    def forward(self, noise):
        return self.gen(noise)

def generate_image(save_path):
    z_dim = 100
    img_dim = 28*28
    generator = SimpleGenerator(z_dim, img_dim)
    
    noise = torch.randn(1, z_dim)
    fake_img = generator(noise).view(28, 28).detach().numpy()
    
    img = Image.fromarray(((fake_img + 1) / 2 * 255).astype('uint8'))
    img.save(save_path)
