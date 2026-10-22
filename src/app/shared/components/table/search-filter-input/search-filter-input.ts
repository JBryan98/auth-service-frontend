import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  selector: 'app-search-filter-input',
  styleUrl: './search-filter-input.css',
  templateUrl: './search-filter-input.html',
})
export class SearchFilterInput implements OnInit {
  initialValue = input.required<string>();
  debounceTime = input<number>(500);

  searchFilter = signal('');
  debouncedSearch = output<string>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly searchChanges = new Subject<string>();

  ngOnInit() {
    this.searchFilter.set(this.initialValue());

    this.searchChanges
      .pipe(
        debounceTime(this.debounceTime()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.debouncedSearch.emit(value);
      });
  }

  onChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.searchFilter.set(value);
    this.searchChanges.next(value);
  }

  cleanFilter() {
    this.searchFilter.set('');
    this.searchChanges.next('');
  }
}
