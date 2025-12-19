import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core'; // <--- 1. Import
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { SkillService } from '../../services/skill.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  editData: any = {};
  
  // Gestion des Compétences
  allSkills: any[] = [];
  filteredSkills: any[] = [];
  skillQuery: string = '';

  constructor(
    private userService: UserService,
    private skillService: SkillService,
    private cd: ChangeDetectorRef // <--- 2. Injection indispensable
  ) {}

  ngOnInit() {
    this.loadProfile();
    // Charge les skills pour l'autocomplete
    this.skillService.getAll().subscribe(skills => {
      this.allSkills = skills;
      this.cd.detectChanges(); // <--- Mise à jour
    });
  }

  loadProfile() {
    this.userService.getProfile().subscribe(u => {
      this.user = u;
      this.editData = {
        fullName: u.fullName,
        institution: u.institution,
        statut: u.statut,
        bio: u.bio
      };
      this.cd.detectChanges(); // <--- 3. LE FIX EST ICI : On force l'affichage
    });
  }

  // --- AUTOCOMPLETE LOGIQUE ---

  onSearchSkill() {
    if (!this.skillQuery.trim()) {
      this.filteredSkills = [];
      return;
    }

    const query = this.skillQuery.toLowerCase();

    this.filteredSkills = this.allSkills.filter(skill => 
      skill.label.toLowerCase().includes(query) && 
      !this.hasSkill(skill.id)
    );
    // Pas besoin de detectChanges ici car c'est un événement synchrone (input), mais au cas où :
    this.cd.detectChanges();
  }

  selectSkill(skill: any) {
    this.userService.addSkill(skill.id).subscribe(updatedUser => {
      this.user = updatedUser;
      this.skillQuery = '';
      this.filteredSkills = [];
      this.cd.detectChanges(); // <--- On met à jour l'écran après l'ajout
    });
  }

  // --- AUTRES ACTIONS ---

  removeSkill(skillId: number) {
    if(confirm('Retirer cette compétence ?')) {
      this.userService.removeSkill(skillId).subscribe(u => {
        this.user = u;
        this.cd.detectChanges(); // <--- On met à jour l'écran après suppression
      });
    }
  }

  updateProfile() {
    const cleanData = {
        fullName: this.editData.fullName,
        institution: this.editData.institution,
        statut: this.editData.statut,
        bio: this.editData.bio
    };
    this.userService.updateProfile(cleanData).subscribe({
      next: (u) => { 
        this.user = u; 
        alert('Profil mis à jour !'); 
        this.cd.detectChanges(); // <--- On met à jour l'écran
      },
      error: () => alert('Erreur lors de la mise à jour.')
    });
  }

  hasSkill(skillId: number): boolean {
    return this.user?.skills?.some(s => s.id === skillId) ?? false;
  }

  getInitials(name: string): string {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '';
  }
}