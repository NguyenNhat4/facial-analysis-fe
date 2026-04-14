the landmarks currently being returned:

### 1. Cephalometric X-Ray API (api.py)
This API detects skeletal, dental, and soft tissue landmarks. Following the recent update to match your documentation, it now filters and returns only the following **18 specific landmarks**:

**Skeletal Landmarks:**
- `S` (Sella)
- `N` (Nasion)
- `A` (A-point)
- `B` (B-point)
- `go` (Gonion)
- `Me` (Menton)
- `Gn` (Gnathion)

**Dental Landmarks:**
- `I` (Upper Incisor Tip)
- `UIA` (Upper Incisor Apex)
- `i` (Lower Incisor Tip)
- `LIA` (Lower Incisor Apex)

**Soft Tissue & Aesthetic Landmarks:**
- `Pn` (Pronasale)
- `Sn` (Subnasale / mapped internally)
- `ls` (Labrale superius)
- `li` (Labrale inferius)
- `Pg'` (Soft Tissue Pogonion)
- `Po` (Porion)
- `Or` (Orbitale)

### 2. Facial Analysis API (api.py)
This API is specifically trained to detect **8 soft-tissue facial landmarks** (HRNet with 8 keypoints):
1. `Glabella`
2. `N'` (Soft Tissue Nasion)
3. `Pronasal` (Pronasale)
4. `Subnasale`
5. `Labiale sup` (Upper Lip / Ls)
6. `Labiale inf` (Lower Lip / Li)
7. `B'` (Soft Tissue B-point)
8. `Pog'` (Soft Tissue Pogonion)