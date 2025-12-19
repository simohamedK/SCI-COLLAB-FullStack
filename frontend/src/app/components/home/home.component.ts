import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User } from '../../models/user.model';
import { Post, PostService } from '../../services/post.service';
import { SkillService } from '../../services/skill.service';
import { SocialService } from '../../services/social.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  posts: Post[] = [];
  friends: any[] = [];
  pendingRequests: any[] = [];
  allSkills: any[] = [];
  sentRequests: any[] = [];

  // Variables pour la recherche
  searchQuery: string = '';
  searchResults: User[] = [];
  searchSubject = new Subject<string>();

  // AUTOCOMPLETE POST
  postSkillQuery: string = '';
  filteredPostSkills: any[] = [];

  // VARIABLES POUR L'ÉDITION
  editingPostId: number | null = null;
  editFormData = { title: '', content: '' };

  viewMode: 'all' | 'recommended' | 'my-posts' = 'all';
  newPost = { title: '', content: '', skillIds: [] as number[] };
  
  selectedFriend: User | null = null;
  messages: any[] = [];
  newMessage = '';

  constructor(
    private postService: PostService,
    private socialService: SocialService,
    private userService: UserService,
    private skillService: SkillService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.getProfile().subscribe(u => this.currentUser = u);
    this.skillService.getAll().subscribe(s => this.allSkills = s);
    this.loadData();
    
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query.length > 1) {
        this.userService.searchUsers(query).subscribe(res => {
          this.searchResults = res;
          this.cd.detectChanges();
        });
      } else {
        this.searchResults = [];
        this.cd.detectChanges();
      }
    });
  }

  loadData() {
    this.loadPosts(); // Charge les posts par défaut (Récents)
    
    this.socialService.getFriends().subscribe(f => {
      this.friends = f;
      this.cd.detectChanges();
    });

    this.socialService.getPending().subscribe(p => {
      this.pendingRequests = p;
      this.cd.detectChanges();
    });

    this.socialService.getSentRequests().subscribe(s => {
      this.sentRequests = s;
      this.cd.detectChanges();
    });
  }

  // --- GESTION DES VUES (Récents / Recommandés / Mes Posts) ---

  switchView(mode: 'all' | 'recommended' | 'my-posts') {
    this.viewMode = mode;
    
    if (mode === 'all') {
      this.loadPosts();
    } else if (mode === 'recommended') {
      this.loadRecommendedPosts();
    } else if (mode === 'my-posts') {
      this.loadMyPosts();
    }
  }

  // 1. Charger TOUS les posts (Récents)
  loadPosts() {
    this.postService.getAll().subscribe(p => {
      this.posts = p;
      this.cd.detectChanges();
    });
  }

  // 2. Charger les posts Recommandés
  loadRecommendedPosts() {
    this.postService.getRecommended().subscribe(p => {
      this.posts = p;
      this.cd.detectChanges();
    });
  }

  // 3. Charger MES posts uniquement
  loadMyPosts() {
    this.postService.getAll().subscribe(allPosts => {
      if (this.currentUser) {
        // Filtre côté client : on ne garde que ceux où je suis l'auteur
        this.posts = allPosts.filter(p => p.author.id === this.currentUser!.id);
      }
      this.cd.detectChanges();
    });
  }

  // --- GESTION DES SKILLS DU POST ---

  onSearchPostSkill() {
    if (!this.postSkillQuery.trim()) {
      this.filteredPostSkills = [];
      return;
    }
    const query = this.postSkillQuery.toLowerCase();
    this.filteredPostSkills = this.allSkills.filter(s => 
      s.label.toLowerCase().includes(query) && 
      !this.newPost.skillIds.includes(s.id)
    );
  }

  selectPostSkill(skill: any) {
    this.newPost.skillIds.push(skill.id);
    this.postSkillQuery = ''; 
    this.filteredPostSkills = []; 
  }

  removeSkillFromPost(skillId: number) {
    this.newPost.skillIds = this.newPost.skillIds.filter(id => id !== skillId);
  }

  getSkillName(id: number) { return this.allSkills.find(s => s.id === id)?.label; }

  // --- ACTIONS POSTS ---

  publishPost() { 
    this.postService.create(this.newPost).subscribe(() => { 
      this.newPost = {title:'',content:'',skillIds:[]}; 
      // Après publication, on revient sur la vue "Récents" ou on recharge la vue actuelle
      if (this.viewMode === 'my-posts') {
        this.loadMyPosts();
      } else {
        this.loadPosts(); 
      }
    }); 
  }

  postComment(pid: number, c: string) { 
    if(c.trim()) {
      this.postService.addComment(pid, c).subscribe(() => {
        // Rafraichir selon la vue active pour ne pas perdre le contexte
        if (this.viewMode === 'my-posts') this.loadMyPosts();
        else if (this.viewMode === 'recommended') this.loadRecommendedPosts();
        else this.loadPosts();
      }); 
    }
  }

  // --- GESTION AMIS & REQUETES ---

  acceptRequest(id: number) { this.socialService.acceptRequest(id).subscribe(() => this.loadData()); }
  
  sendFriendRequest(userId: number) {
    this.socialService.sendRequest(userId).subscribe(() => {
      alert('Demande envoyée !');
      this.searchQuery = ''; 
      this.searchResults = []; 
    });
  }
  
  cancelRequest(requestId: number) {
    this.socialService.cancelRequest(requestId).subscribe(() => {
      this.sentRequests = this.sentRequests.filter(r => r.id !== requestId);
    });
  }

  removeFriend(friendId: number) {
    if(confirm('Êtes-vous sûr de vouloir retirer cette personne de vos amis ?')) {
      this.socialService.removeFriend(friendId).subscribe(() => {
        this.loadData();
      });
    }
  }

  // --- UTILITAIRES ---

  getInitials(name: string) { return name ? name.split(' ').map(x=>x[0]).join('').substring(0,2).toUpperCase() : ''; }

  canAddUser(authorId: number): boolean {
    if (!this.currentUser || authorId === this.currentUser.id) return false;
    const isFriend = this.friends.some(f => f.receiver.id === authorId || f.requester?.id === authorId);
    if (isFriend) return false;
    const isSent = this.sentRequests.some(r => r.receiver.id === authorId);
    if (isSent) return false;
    const isPending = this.pendingRequests.some(r => r.requester.id === authorId);
    if (isPending) return false;
    return true;
  }
  
  sendRequestToAuthor(authorId: number) {
      this.socialService.sendRequest(authorId).subscribe(() => {
          alert('Invitation envoyée !');
          this.loadData();
      });
  }

  // --- CHAT ---

  openChat(friend: User) { this.selectedFriend = friend; this.socialService.getMessages(friend.id).subscribe(m => this.messages = m); }
  
  sendMessage() {
    if(!this.newMessage.trim() || !this.selectedFriend) return;
    this.socialService.sendMessage(this.selectedFriend.id, this.newMessage).subscribe(m => {
      this.messages.push(m);
      this.newMessage = '';
    });
  }

  onSearchInput(query: string) { this.searchSubject.next(query); }

  // --- GESTION DE L'ÉDITION ---

  startEditing(post: Post) {
    this.editingPostId = post.id;
    this.editFormData = { title: post.title, content: post.content };
  }

  cancelEditing() {
    this.editingPostId = null;
    this.editFormData = { title: '', content: '' };
  }

  saveEditedPost() {
    if (!this.editingPostId) return;
    this.postService.update(this.editingPostId, this.editFormData).subscribe({
      next: () => {
        alert('Post modifié avec succès !');
        this.editingPostId = null;
        // Recharger selon la vue active
        if (this.viewMode === 'my-posts') this.loadMyPosts();
        else if (this.viewMode === 'recommended') this.loadRecommendedPosts();
        else this.loadPosts();
      },
      error: () => alert("Erreur lors de la modification.")
    });
  }
}