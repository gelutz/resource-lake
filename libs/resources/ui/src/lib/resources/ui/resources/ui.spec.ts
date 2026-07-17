import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourcesUi } from './ui';

describe('ResourcesUi', () => {
  let component: ResourcesUi;
  let fixture: ComponentFixture<ResourcesUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourcesUi],
    }).compileComponents();

    fixture = TestBed.createComponent(ResourcesUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
